// Balón: estados held (dribla), pass, shot (arco), drop (red), loose (rebote/suelto), dead (balón muerto).

import { COURT } from '../config/constants.js';
import { Sfx } from './AudioSystem.js';
import { ensureBall } from './TextureFactory.js';
import { isThree } from '../utils/court.js';
import { clamp, rand } from '../utils/math.js';

const G = 380;
export class Ball {
  constructor(scene) {
    this.scene = scene;
    ensureBall(scene);
    this.shadow = scene.add.image(0, 0, 'shadow').setDepth(1).setScale(0.6);
    this.sprite = scene.add.image(0, 0, 'ball').setDepth(500);
    this.x = COURT.cx; this.y = COURT.cy; this.z = 0; this.vx = this.vy = this.vz = 0;
    this.mode = 'dead'; this.holder = null; this.lastSide = 0;
    this.noPickup = 0; this.noGrab = null; this.noGrabT = 0;
    this.shot = null; this.pass = null; this.t = 0; this.dribT = 0;
    this.sprite.setVisible(true);
  }
  get inFlight() { return this.mode === 'shot' || this.mode === 'pass'; }
  setHolder(p) {
    this.holder = p; this.mode = 'held'; this.lastSide = p.side; this.shot = null; this.pass = null;
    this.scene.match.onPossession(p);
  }
  placeDead(x, y) { this.holder = null; this.mode = 'dead'; this.x = x; this.y = y; this.z = 8; this.vx = this.vy = this.vz = 0; this.shot = null; }
  startPass(from, target, speed) {
    this.holder = null; this.mode = 'pass';
    this.pass = { from, target, t: 0, speed: speed || 250, tried: new Set() };
    this.x = from.x + Math.cos(from.facing) * 6; this.y = from.y; this.z = 9; this.lastSide = from.side;
    Sfx.pass();
  }
  startShot(shooter, hoop, make, type, ft) {
    this.holder = null; this.mode = 'shot'; this.lastSide = shooter.side;
    const d = Math.hypot(hoop.x - shooter.x, hoop.y - shooter.y);
    const dur = type === 'layup' ? 0.5 : clamp(0.55 + d / 300, 0.7, 1.05);
    this.shot = {
      shooter, hoop, make, type, ft: !!ft, t: 0, dur,
      sx: shooter.x, sy: shooter.y, arc: type === 'layup' ? 14 : 20 + d * 0.18,
      three: !ft && isThree(shooter.x, shooter.y, hoop)
    };
    this.z0 = 18;
    Sfx.shoot();
  }
  deflect(blocker) {
    const s = this.shot;
    this.mode = 'loose'; this.shot = null;
    const ang = Math.atan2(this.y - blocker.y, this.x - blocker.x) + rand(-0.8, 0.8);
    this.vx = Math.cos(ang) * 110; this.vy = Math.sin(ang) * 110; this.vz = 70;
    this.lastSide = blocker.side; this.noPickup = 0.2;
    Sfx.block();
    this.scene.match.onBlocked(blocker, s ? s.shooter : null);
  }
  knockLoose(from, dirAngle) {
    this.holder = null; this.mode = 'loose';
    this.vx = Math.cos(dirAngle) * 90; this.vy = Math.sin(dirAngle) * 90; this.vz = 40; this.z = 8;
    this.noPickup = 0.15;
    if (from) { this.noGrab = from; this.noGrabT = 0.5; }
  }
  update(dt) {
    const sc = this.scene, players = sc.players, C = COURT;
    this.noPickup = Math.max(0, this.noPickup - dt);
    this.noGrabT = Math.max(0, this.noGrabT - dt);
    let depth = null;
    switch (this.mode) {
      case 'held': {
        const p = this.holder; if (!p) { this.mode = 'dead'; break; }
        this.dribT += dt * (Math.hypot(p.vx, p.vy) > 15 ? 11 : 7);
        this.x = p.x + Math.cos(p.facing) * 6; this.y = p.y + 1 + Math.sin(p.facing) * 2;
        if (p.shootTimer > 0) {
          const pr = 1 - p.shootTimer / (p.shootDur || 0.3);
          this.z = 8 + pr * 12 + (p.jz || 0);
        } else this.z = 3 + Math.abs(Math.sin(this.dribT)) * 9;
        if (this.z < 4.5 && Math.floor(this.dribT / Math.PI) !== this._lb) { this._lb = Math.floor(this.dribT / Math.PI); Sfx.bounce(); }
        depth = p.y + (Math.sin(p.facing) >= -0.2 ? 0.5 : -0.5);
        break;
      }
      case 'pass': {
        const ps = this.pass, tg = ps.target;
        ps.t += dt;
        const dx = tg.x - this.x, dy = tg.y - this.y, d = Math.hypot(dx, dy);
        const step = ps.speed * dt;
        if (d <= Math.max(step, 8)) { this.setHolder(tg); break; }
        this.x += dx / d * step; this.y += dy / d * step;
        this.z = 9 + Math.sin(Math.min(1, ps.t / 0.5) * Math.PI) * 3;
        for (const p of players) {
          if (p.side === ps.from.side || ps.tried.has(p) || p.stunTimer > 0) continue;
          if (Math.hypot(p.x - this.x, p.y - this.y) < 9) {
            ps.tried.add(p);
            if (Math.random() < (0.04 + p.data.def / 1200) * sc.aiDefMul(p)) { this.setHolder(p); Sfx.steal(); sc.match.onSteal(p, ps.from); return this.render(depth); }
          }
        }
        if (ps.t > 1.6) { this.mode = 'loose'; this.vx = this.vy = 0; this.vz = 0; }
        depth = 600;
        break;
      }
      case 'shot': {
        const s = this.shot;
        s.t += dt / s.dur;
        const t = Math.min(1, s.t);
        this.x = s.sx + (s.hoop.x - s.sx) * t; this.y = s.sy + (s.hoop.y - s.sy) * t;
        this.z = this.z0 + (14 - this.z0) * t + s.arc * 4 * t * (1 - t);
        depth = (s.make && t > 0.92) ? 700 : 900;
        if (s.t < 0.45) {
          for (const p of players) {
            if (p.side === s.shooter.side || p.blockTimer <= 0) continue;
            if (Math.hypot(p.x - this.x, p.y - this.y) < 18 && this.z < 36 + (p.jz || 0) && Math.random() < 0.5) { this.deflect(p); return this.render(depth); }
          }
        }
        if (s.t >= 1) {
          this.x = s.hoop.x; this.y = s.hoop.y;
          this.scene.rimShake(s.hoop);
          if (s.make) {
            this.mode = 'drop'; this.vz = -40; this.vx = this.vy = 0; this.z = 14;
            Sfx.swish();
            sc.match.onShotMade(s);
          } else {
            this.mode = 'loose'; this.noPickup = 0.3;
            const inw = -s.hoop.dir;
            this.vx = inw * rand(40, 90) + rand(-20, 20); this.vy = rand(-70, 70); this.vz = rand(70, 120);
            Sfx.rim();
            sc.match.onShotMissed(s);
          }
          this.shot = s.make ? s : null;
        }
        break;
      }
      case 'drop': {
        this.vz -= G * dt; this.z += this.vz * dt;
        if (this.z <= 0) { this.z = 0; this.mode = 'dead'; this.vz = 0; }
        depth = 700;
        break;
      }
      case 'loose': {
        this.vz -= G * dt; this.z += this.vz * dt;
        if (this.z <= 0) {
          this.z = 0;
          if (Math.abs(this.vz) > 40) { this.vz = -this.vz * 0.55; Sfx.bounce(); } else this.vz = 0;
        }
        const fr = this.z === 0 ? Math.pow(0.35, dt) : 1;
        this.vx *= fr; this.vy *= fr;
        this.x += this.vx * dt; this.y += this.vy * dt;
        if (this.x < C.x - 1 || this.x > C.x + C.w + 1 || this.y < C.y - 1 || this.y > C.y + C.h + 1) {
          sc.match.onBallOut(this.x, this.y); break;
        }
        if (this.noPickup <= 0 && this.z < 14 && sc.match.canPickup()) {
          let best = null, bd = 11;
          for (const p of players) {
            if (p.stunTimer > 0 || p.freeze) continue;
            if (p === this.noGrab && this.noGrabT > 0) continue;
            const d = Math.hypot(p.x - this.x, p.y - 4 - this.y);
            const dd = d - (p.data.def - 70) / 60;
            if (dd < bd) { bd = dd; best = p; }
          }
          if (best) this.setHolder(best);
        }
        depth = 500;
        break;
      }
      default: depth = 500;
    }
    this.render(depth);
  }
  render(depth) {
    this.sprite.setPosition(Math.round(this.x), Math.round(this.y - this.z));
    if (depth !== null && depth !== undefined) this.sprite.setDepth(depth);
    this.shadow.setPosition(Math.round(this.x), Math.round(this.y)).setAlpha(Math.max(0.2, 1 - this.z / 70));
  }
}
