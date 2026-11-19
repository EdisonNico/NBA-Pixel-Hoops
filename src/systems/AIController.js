// IA de compañeros y rivales: ataque, defensa 1 a 1, rebotes y balones sueltos.

import { COURT } from '../config/constants.js';
import { isThree } from '../utils/court.js';
import { clamp, rand } from '../utils/math.js';

const C = COURT;
const SPOTS = [[120, 0], [85, -78], [85, 78], [45, -48], [38, 42]];
export class AIController {
  constructor(scene) { this.scene = scene; }
  reactToShot(shooter) {
    const sc = this.scene;
    sc.players.forEach(p => {
      if (p.side === shooter.side || p === sc.controlled || p.freeze) return;
      if (Math.hypot(p.x - shooter.x, p.y - shooter.y) < 28 && Math.random() < (0.08 + p.data.def / 600) * sc.aiDefMul(p)) p.startBlock();
    });
  }
  update(dt) {
    const sc = this.scene, m = sc.match, b = sc.ball;
    const live = m.phase === 'live' || m.phase === 'inbound' || m.phase === 'dead';
    const handler = b.mode === 'held' ? b.holder : null;
    // defensor principal sobre el balón (por equipo)
    const guard = [null, null];
    if (handler) {
      const ds = sc.players.filter(p => p.side !== handler.side);
      ds.sort((a, c) => Math.hypot(a.x - handler.x, a.y - handler.y) - Math.hypot(c.x - handler.x, c.y - handler.y));
      guard[1 - handler.side] = ds[0];
    }
    // jugadores más cercanos al balón suelto (por equipo)
    const chase = [null, null];
    if (b.mode === 'loose' || b.mode === 'dead') {
      [0, 1].forEach(s => {
        const t = sc.players.filter(p => p.side === s).sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y));
        chase[s] = t[0];
      });
    }
    const crash = {};
    if (b.mode === 'shot' && b.shot) {
      [0, 1].forEach(s => {
        sc.players.filter(p => p.side === s && p !== b.shot.shooter)
          .sort((a, c) => Math.hypot(a.x - b.shot.hoop.x, a.y - b.shot.hoop.y) - Math.hypot(c.x - b.shot.hoop.x, c.y - b.shot.hoop.y))
          .slice(0, 2).forEach(p => { crash[sc.players.indexOf(p)] = true; });
      });
    }
    sc.players.forEach((p, i) => {
      if (p === sc.controlled && m.phase !== 'ft') return;
      if (p.freeze || !live) { p.setMove(0, 0, false); return; }
      const ai = p.ai || (p.ai = { think: rand(0, 0.3), offT: 0, off: { x: 0, y: 0 }, stealT: 0 });
      ai.think -= dt; ai.offT -= dt; ai.stealT -= dt;
      if (ai.offT <= 0) { ai.offT = rand(1.5, 3); ai.off = { x: rand(-16, 16), y: rand(-16, 16) }; }
      if (b.mode === 'held' && b.holder === p) return this.handler(p, ai, dt);
      if (b.mode === 'held') return p.side === b.holder.side ? this.offBall(p, ai) : this.defend(p, ai, handler, guard[p.side] === p);
      if (b.mode === 'shot' && crash[i]) return p.moveToward(b.shot.hoop.x - b.shot.hoop.dir * (20 + (i % 3) * 8), b.shot.hoop.y + ((i % 5) - 2) * 9, true);
      if (b.mode === 'pass') {
        if (b.pass.target === p) return p.setMove(0, 0, false);
        return b.pass.from.side === p.side ? this.offBall(p, ai) : this.defendMark(p, ai, null);
      }
      if (chase[p.side] === p) return p.moveToward(b.x + b.vx * 0.12, b.y + b.vy * 0.12, true, 2);
      const side = b.lastSide;
      return p.side === side ? this.offBall(p, ai) : this.defendMark(p, ai, null);
    });
  }
  spot(p, ai) {
    const h = this.scene.match.hoopFor(p.side), inw = -h.dir, s = SPOTS[p.idx % 5];
    return { x: clamp(h.x + inw * s[0] + ai.off.x, C.x + 8, C.x + C.w - 8), y: clamp(C.cy + s[1] + ai.off.y, C.y + 10, C.y + C.h - 6) };
  }
  offBall(p, ai) {
    const s = this.spot(p, ai), d = Math.hypot(s.x - p.x, s.y - p.y);
    p.moveToward(s.x, s.y, d > 70, 5);
  }
  defend(p, ai, handler, isGuard) {
    if (isGuard) {
      const sc = this.scene, h = sc.match.hoopFor(1 - p.side);
      const dx = h.x - handler.x, dy = h.y - handler.y, d = Math.hypot(dx, dy) || 1;
      const tx = handler.x + dx / d * 12, ty = handler.y + dy / d * 12;
      const dist = Math.hypot(handler.x - p.x, handler.y - p.y);
      p.moveToward(tx, ty, dist > 35, 2);
      if (dist < 20 && ai.stealT <= 0 && sc.match.phase === 'live') {
        ai.stealT = rand(0.9, 1.6);
        if (Math.random() < 0.1 * sc.aiDefMul(p)) sc.match.attemptSteal(p);
      }
    } else this.defendMark(p, ai, handler);
  }
  defendMark(p, ai, handler) {
    const sc = this.scene, opps = sc.players.filter(o => o.side !== p.side);
    let mark = opps[p.idx];
    if (handler && mark === handler) mark = opps[(p.idx + 1) % 5];
    const h = sc.match.hoopFor(1 - p.side);
    const dx = h.x - mark.x, dy = h.y - mark.y, d = Math.hypot(dx, dy) || 1;
    let tx = mark.x + dx / d * 16, ty = mark.y + dy / d * 16;
    const bh = Math.hypot(sc.ball.x - h.x, sc.ball.y - h.y);
    if (bh < 100) { const k = 0.25; tx += (h.x - tx) * k; ty += (h.y - ty) * k; }
    p.moveToward(tx, ty, Math.hypot(tx - p.x, ty - p.y) > 50, 4);
  }
  handler(p, ai, dt) {
    const sc = this.scene, m = sc.match, h = m.hoopFor(p.side), inw = -h.dir;
    if (m.phase !== 'live') return p.setMove(0, 0, false);
    const opps = sc.players.filter(o => o.side !== p.side);
    let nd = opps[0], ndd = 1e9;
    opps.forEach(o => { const d = Math.hypot(o.x - p.x, o.y - p.y); if (d < ndd) { ndd = d; nd = o; } });
    const dx = h.x - p.x, dy = h.y - p.y, dh = Math.hypot(dx, dy) || 1;
    let mx = dx / dh, my = dy / dh;
    if (ndd < 38) { const ax = (p.x - nd.x) / (ndd || 1), ay = (p.y - nd.y) / (ndd || 1); mx += ax * 0.9; my += ay * 0.9; }
    if (dh < 40) { mx = dx / dh; my = dy / dh; }
    p.setMove(mx, my, ndd > 30);
    if (ai.think > 0 || p.holdTime < 0.5 || p.shootTimer > 0) return;
    ai.think = rand(0.2, 0.4);
    const three = isThree(p.x, p.y, h), dd = p.data;
    if (dh < 46) { if (Math.random() < 0.85) m.attemptShot(p); return; }
    if (m.shotClock < 4 && dh < 220) { m.attemptShot(p); return; }
    // pase
    if (ndd < 26 && p.holdTime > 0.8 && Math.random() < 0.5) {
      const mates = sc.players.filter(o => o.side === p.side && o !== p);
      let best = null, bs = -1e9;
      mates.forEach(o => {
        const od = Math.min(...opps.map(q => Math.hypot(q.x - o.x, q.y - o.y)));
        const dist = Math.hypot(o.x - p.x, o.y - p.y);
        const prog = (Math.abs(p.x - h.x) - Math.abs(o.x - h.x));
        const s = od + prog * 0.3 - dist * 0.1 + rand(0, 10);
        if (dist < 190 && dist > 25 && s > bs) { bs = s; best = o; }
      });
      if (best) { p.facing = Math.atan2(best.y - p.y, best.x - p.x); sc.ball.startPass(p, best); return; }
    }
    if (dh < 175) {
      let want = (ndd > 30 ? 0.3 : 0.07) * (three ? dd.thr / 90 : dd.sho / 90);
      if (three && dd.thr < 72) want *= 0.35;
      if (Math.random() < want) m.attemptShot(p);
    }
  }
}
