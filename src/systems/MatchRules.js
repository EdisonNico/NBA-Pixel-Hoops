// Reglas: cuartos, relojes, posesión, puntos, faltas, tiros libres, saques y fin de partido.

import { COLORS, COURT, FT_OFF, HOOPS, SHOT_CLOCK } from '../config/constants.js';
import { Sfx } from './AudioSystem.js';
import { Settings } from './SettingsStore.js';
import { isThree } from '../utils/court.js';
import { fmtClock } from '../utils/format.js';
import { clamp, rand } from '../utils/math.js';

const C = COURT;
export class MatchRules {
  constructor(scene) {
    this.scene = scene;
    this.score = [0, 0]; this.quarter = 1; this.qLen = Settings.quarterSeconds();
    this.clock = this.qLen; this.shotClock = SHOT_CLOCK;
    this.phase = 'inbound'; this.poss = 0; this.fouls = [0, 0]; this.flip = false;
    this.ibT = 0; this.deadT = 0; this.deadNext = null; this.breakT = 0;
    this.ft = null; this.overT = 0; this.ot = false;
    this.stats = [0, 1].map(() => ({ fgm: 0, fga: 0, tpm: 0, tpa: 0, stl: 0, blk: 0, foul: 0, ftm: 0, fta: 0 }));
  }
  // ---- geometría ----
  hoopFor(side) { return (side === 0) !== this.flip ? HOOPS.right : HOOPS.left; }
  defHoop(side) { return this.hoopFor(1 - side); }
  canPickup() { return this.phase === 'live'; }
  displayClock() {
    const total = this.ot ? 300 : 720;
    return fmtClock(this.clock * total / this.qLen);
  }
  // ---- flujo ----
  start() { this.setupQuarter(0); }
  setupQuarter(side) {
    this.clock = this.ot ? 60 : this.qLen; this.fouls = [0, 0];
    this.startInbound(side, C.cx, C.y - 8, this.ot ? 'TIEMPO EXTRA' : 'CUARTO ' + this.quarter + (this.quarter === 3 ? ' - CAMBIO DE CANCHA' : ''));
  }
  startInbound(side, x, y, text) {
    const sc = this.scene, ball = sc.ball;
    this.phase = 'inbound'; this.poss = side; this.shotClock = SHOT_CLOCK; this.ibT = 1.4;
    // punto de saque en el borde exterior más cercano
    x = clamp(x, C.x, C.x + C.w); y = clamp(y, C.y, C.y + C.h);
    const dl = x - C.x, dr = C.x + C.w - x, dt = y - C.y, db = C.y + C.h - y, m = Math.min(dl, dr, dt, db);
    let sx = x, sy = y;
    if (m === dl) sx = C.x - 9; else if (m === dr) sx = C.x + C.w + 9;
    else if (m === dt) sy = C.y - 9; else sy = C.y + C.h + 9;
    const team = sc.players.filter(p => p.side === side);
    team.sort((a, b) => Math.hypot(a.x - sx, a.y - sy) - Math.hypot(b.x - sx, b.y - sy));
    const ib = team[0];
    sc.players.forEach(p => { p.freeze = false; p._shooting = false; p.shootTimer = 0; p.outside = false; });
    ib.outside = true; ib.freeze = true; ib.place(sx, sy);
    ib.facing = Math.atan2(C.cy - sy, C.cx - sx);
    this.inbounder = ib;
    ball.setHolder(ib);
    if (text) sc.hud.banner(text, COLORS.gold, 1300);
    sc.autoSelect();
  }
  performInbound() {
    const ib = this.inbounder, sc = this.scene;
    ib.outside = false; ib.freeze = false;
    const mates = sc.players.filter(p => p.side === ib.side && p !== ib);
    let best = null, bs = -1e9;
    mates.forEach(p => {
      const d = Math.hypot(p.x - ib.x, p.y - ib.y);
      const open = Math.min(...sc.players.filter(o => o.side !== ib.side).map(o => Math.hypot(o.x - p.x, o.y - p.y)));
      const s = open - Math.abs(d - 110) * 0.4 + Math.random() * 10;
      if (s > bs) { bs = s; best = p; }
    });
    this.phase = 'live';
    sc.ball.startPass(ib, best, 220);
  }
  update(dt) {
    const sc = this.scene;
    // lanzamientos pendientes
    sc.players.forEach(p => {
      if (!p._shooting) return;
      if (!p.hasBall) { p._shooting = false; p.shootTimer = 0; return; }
      if (p.shootTimer <= 0) { p._shooting = false; this.releaseShot(p); }
    });
    switch (this.phase) {
      case 'live': {
        this.clock -= dt;
        const b = sc.ball;
        if (this.poss !== -1 && b.mode !== 'shot') this.shotClock -= dt;
        if (this.clock <= 0) { this.clock = 0; this.endQuarter(); break; }
        if (this.shotClock <= 0 && this.poss !== -1 && b.mode !== 'shot' && b.mode !== 'drop') {
          Sfx.buzzer(); sc.hud.banner('24 SEGUNDOS', COLORS.red, 1200);
          this.startInbound(1 - this.poss, b.x, b.y);
        }
        break;
      }
      case 'inbound':
        this.ibT -= dt;
        if (this.ibT <= 0) this.performInbound();
        break;
      case 'dead':
        this.deadT -= dt;
        if (this.deadT <= 0 && this.deadNext) { const f = this.deadNext; this.deadNext = null; f(); }
        break;
      case 'ft': this.updateFT(dt); break;
      case 'break':
        this.breakT -= dt;
        if (this.breakT <= 0) this.nextQuarter();
        break;
      case 'over':
        this.overT -= dt;
        if (this.overT <= 0 && !this.finished) { this.finished = true; sc.endGame(); }
        break;
    }
    sc.hud.set(this);
  }
  endQuarter() {
    const sc = this.scene;
    Sfx.buzzer();
    sc.players.forEach(p => { p._shooting = false; p.shootTimer = 0; });
    this.phase = 'break'; this.breakT = 3;
    sc.ball.placeDead(sc.ball.x, sc.ball.y);
    if (this.quarter >= 4 && this.score[0] === this.score[1]) sc.hud.banner('EMPATE - TIEMPO EXTRA', COLORS.gold, 2800);
    else if (this.quarter >= 4) sc.hud.banner('FIN DEL PARTIDO', COLORS.gold, 2800);
    else sc.hud.banner('FIN DEL CUARTO ' + this.quarter, COLORS.gold, 2800);
  }
  nextQuarter() {
    if (this.quarter >= 4 && this.score[0] !== this.score[1]) {
      this.phase = 'over'; this.overT = 0.4; return;
    }
    this.quarter++;
    if (this.quarter > 4) this.ot = true;
    if (this.quarter === 3) this.flip = true;
    const side = this.quarter === 2 || this.quarter === 3 ? 1 : (this.quarter === 4 ? 0 : (Math.random() < 0.5 ? 0 : 1));
    this.setupQuarter(side);
  }
  // ---- eventos del balón ----
  onPossession(p) {
    if (this.phase === 'ft' || this.phase === 'dead' || this.phase === 'break' || this.phase === 'over') return;
    if (this.poss !== p.side) { this.poss = p.side; this.shotClock = SHOT_CLOCK; }
    if (this.poss === -1) this.poss = p.side;
    this.scene.autoSelect(p);
  }
  onShotMade(s) {
    const sc = this.scene, side = s.shooter.side, st = this.stats[side];
    const pts = s.ft ? 1 : (s.three ? 3 : 2);
    this.score[side] += pts; s.shooter.pts = (s.shooter.pts || 0) + pts;
    if (s.ft) { st.ftm++; st.fta++; } else { st.fgm++; st.fga++; if (s.three) { st.tpm++; st.tpa++; } }
    sc.hud.set(this);
    const txt = s.ft ? '+1' : (s.three ? 'TRIPLE! +3' : '+' + pts);
    sc.hud.banner(txt + '  ' + s.shooter.data.name.split(' ').slice(-1)[0].toUpperCase(), sc.teamColor(side), 1200);
    if (s.ft) { this.ft.pending = true; this.ft.made = true; this.ft.t = 0.9; return; }
    this.phase = 'dead'; this.deadT = 1.0; this.poss = -1;
    const h = s.hoop;
    this.deadNext = () => this.startInbound(1 - side, h.dir < 0 ? C.x : C.x + C.w, C.cy, null);
    sc.cheer();
  }
  onShotMissed(s) {
    const st = this.stats[s.shooter.side];
    if (s.ft) { st.fta++; this.ft.pending = true; this.ft.made = false; this.ft.t = 0.8; return; }
    st.fga++; if (s.three) st.tpa++;
    this.poss = -1; this.shotClock = SHOT_CLOCK;
  }
  onBlocked(blocker, shooter) {
    this.stats[blocker.side].blk++;
    if (shooter) this.stats[shooter.side].fga++;
    this.poss = -1;
    this.scene.hud.banner('BLOQUEO!', COLORS.gold, 900);
  }
  onSteal(p) { this.stats[p.side].stl++; this.scene.hud.banner('ROBO!', COLORS.gold, 800); }
  onBallOut(x, y) {
    if (this.phase !== 'live') return;
    const last = this.scene.ball.lastSide;
    Sfx.whistle();
    this.scene.hud.banner('FUERA', COLORS.white, 900);
    this.startInbound(1 - last, x, y, null);
  }
  // ---- acciones de jugadores ----
  attemptShot(p) {
    if (this.phase !== 'live' || !p.hasBall || p._shooting) return false;
    const hoop = this.hoopFor(p.side);
    const d = Math.hypot(hoop.x - p.x, hoop.y - p.y);
    const type = d < 46 ? 'layup' : 'jump';
    if (p.startShot(hoop, type)) { p._shooting = true; return true; }
    return false;
  }
  shotChance(p, hoop, type) {
    const sc = this.scene, d = Math.hypot(hoop.x - p.x, hoop.y - p.y), dt = p.data;
    const three = isThree(p.x, p.y, hoop);
    let c;
    if (type === 'layup') c = 0.7 + (dt.sho - 70) / 250;
    else if (three) c = 0.34 + (dt.thr - 70) / 170;
    else c = 0.5 + (dt.sho - 70) / 180 - Math.max(0, d - 70) / 500;
    const opp = sc.players.filter(o => o.side !== p.side);
    const dd = Math.min(...opp.map(o => Math.hypot(o.x - p.x, o.y - p.y)));
    if (dd < 14) c -= 0.2; else if (dd < 26) c -= 0.1; else if (dd < 40) c -= 0.04;
    if (opp.some(o => o.blockTimer > 0 && Math.hypot(o.x - p.x, o.y - p.y) < 30)) c -= 0.12;
    if (p.side === 1) c += [-0.06, 0, 0.05][Settings.get('diff')];
    return clamp(c, 0.05, 0.92);
  }
  releaseShot(p) {
    const sc = this.scene, hoop = p.shotHoop || this.hoopFor(p.side), type = p.shotType;
    const opp = sc.players.filter(o => o.side !== p.side);
    const near = opp.filter(o => o.blockTimer > 0 && Math.hypot(o.x - p.x, o.y - p.y) < 22);
    if (near.length) {
      if (Math.random() < 0.12) { this.onFoul(near[0], p, true); return; }
      if (Math.random() < 0.3) { sc.ball.deflect(near[0]); return; }
    }
    const make = Math.random() < this.shotChance(p, hoop, type);
    sc.ball.startShot(p, hoop, make, type, false);
  }
  attemptSteal(t) {
    const b = this.scene.ball;
    if (this.phase !== 'live' || t.stealCD > 0 || t.freeze) return false;
    const v = b.holder;
    t.stealCD = 0.9;
    if (!v || v.side === t.side || b.mode !== 'held' || Math.hypot(v.x - t.x, v.y - t.y) > 22) return false;
    const chance = 0.2 + t.data.def / 450 - v.data.pas / 1000;
    const mul = this.scene.aiDefMul(t);
    if (Math.random() < chance * mul) {
      v._shooting = false; v.shootTimer = 0; v.stunTimer = 0.4;
      if (Math.random() < 0.5) { b.setHolder(t); } else { b.knockLoose(v, Math.atan2(v.y - t.y, v.x - t.x) + rand(-1, 1)); b.lastSide = t.side; this.poss = -1; }
      Sfx.steal(); this.onSteal(t);
      return true;
    }
    if (Math.random() < 0.1) this.onFoul(t, v, false);
    return false;
  }
  onFoul(fouler, victim, shooting) {
    const sc = this.scene;
    Sfx.whistle();
    this.stats[fouler.side].foul++; this.fouls[fouler.side]++;
    sc.hud.banner('FALTA #' + fouler.data.num, COLORS.red, 1200);
    let n = 0;
    if (shooting) n = isThree(victim.x, victim.y, this.hoopFor(victim.side)) ? 3 : 2;
    else if (this.fouls[fouler.side] >= 5) n = 2;
    victim._shooting = false; victim.shootTimer = 0;
    if (n > 0) this.startFreeThrows(victim, n);
    else { const b = sc.ball; this.startInbound(victim.side, victim.x, victim.y, null); }
  }
  // ---- tiros libres ----
  startFreeThrows(shooter, n) {
    const sc = this.scene, hoop = this.hoopFor(shooter.side), inw = -hoop.dir;
    const bx = hoop.dir < 0 ? C.x : C.x + C.w;
    this.phase = 'ft'; this.poss = shooter.side;
    this.ft = { shooter, n, i: 0, state: 'wait', t: 1.0, pending: false, made: false, cur: 0, dir: 1, hoop, inw, bx };
    const spots = [[30, -38], [30, 38], [52, -38], [52, 38], [75, -38], [75, 38], [105, -70], [105, 70], [130, 0]];
    let k = 0;
    sc.players.forEach(p => {
      p.freeze = true; p.vx = p.vy = 0; p.mx = p.my = 0; p.outside = false; p._shooting = false; p.shootTimer = 0;
      if (p === shooter) p.place(bx + inw * FT_OFF, C.cy);
      else { const s = spots[k++ % spots.length]; p.place(bx + inw * s[0], C.cy + s[1]); }
      p.facing = Math.atan2(hoop.y - p.y, hoop.x - p.x);
    });
    sc.ball.setHolder(shooter);
    sc.setControlled(shooter.side === 0 ? shooter : sc.controlled);
    sc.hud.banner('TIROS LIBRES x' + n, COLORS.gold, 1200);
  }
  updateFT(dt) {
    const sc = this.scene, f = this.ft;
    const sh = f.shooter;
    if (f.pending) {
      f.t -= dt;
      if (f.t > 0) return;
      f.pending = false; f.i++;
      sc.hud.ftMeter(null);
      if (f.i < f.n) { sc.ball.setHolder(sh); f.state = 'wait'; f.t = 0.8; return; }
      // último tiro
      sc.players.forEach(p => { p.freeze = false; });
      if (f.made) { this.phase = 'dead'; this.deadT = 0.6; this.poss = -1;
        this.deadNext = () => this.startInbound(1 - sh.side, f.hoop.dir < 0 ? C.x : C.x + C.w, C.cy, null); }
      else { this.phase = 'live'; this.poss = -1; this.shotClock = SHOT_CLOCK; }
      return;
    }
    if (sc.ball.mode === 'shot' || sc.ball.mode === 'drop' || sc.ball.mode === 'loose') return;
    if (f.state === 'wait') {
      f.t -= dt;
      if (f.t <= 0) { f.state = 'aim'; f.cur = 0; f.dir = 1; f.aimT = 0; }
    } else if (f.state === 'aim') {
      f.aimT += dt;
      const human = sh.side === 0 && !sc.spectator;
      const w = 0.07 + sh.data.sho / 1200;
      if (human) {
        f.cur += f.dir * dt * 1.6;
        if (f.cur >= 1) { f.cur = 1; f.dir = -1; } else if (f.cur <= 0) { f.cur = 0; f.dir = 1; }
        sc.hud.ftMeter(f.cur, w, 'ESPACIO PARA TIRAR');
        if (sc.ctrl.pressed('shoot')) this.shootFT(Math.abs(f.cur - 0.5) < w ? 1 : 0.12);
      } else if (f.aimT > 0.9) this.shootFT(0.5 + sh.data.sho / 250 > Math.random() ? 1 : 0);
    }
  }
  shootFT(p) {
    const f = this.ft;
    f.state = 'flight';
    this.scene.hud.ftMeter(null);
    this.scene.ball.startShot(f.shooter, f.hoop, Math.random() < p, 'jump', true);
  }
}
