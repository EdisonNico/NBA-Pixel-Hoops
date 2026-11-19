// Teclado. 5v5: W A S D (o flechas) mover, SHIFT correr, ESPACIO tirar, E pasar, Q cambiar, R robar, F bloquear.
// 1 VS 1 (amigo): J1 = W A S D + SHIFT/ESPACIO/R/F;  J2 = FLECHAS + , (correr) ENTER (lanzar) . (robar) - (bloquear).

import { Sfx } from './AudioSystem.js';

// tecla del jugador 2 equivalente a cada acción del jugador 1
const P2 = { shoot: 'enter', steal: 'p2steal', block: 'p2block' };

export class InputController {
  constructor(scene) {
    this.scene = scene;
    this.versus = !!scene.versus;
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      up: K.W, down: K.S, left: K.A, right: K.D, aup: K.UP, adown: K.DOWN, aleft: K.LEFT, aright: K.RIGHT,
      shoot: K.SPACE, pass: K.E, switch: K.Q, sprint: K.SHIFT, steal: K.R, block: K.F,
      pause: K.P, esc: K.ESC, help: K.H,
      enter: K.ENTER, p2run: K.COMMA, p2steal: K.PERIOD, p2block: K.MINUS
    });
    this.p = {};
    scene.input.keyboard.addCapture([K.SPACE, K.UP, K.DOWN, K.LEFT, K.RIGHT]);
  }
  pressed(n) { return !!this.p[n]; }
  /** Pulsación de una acción (shoot/steal/block) para el jugador del lado `side`. */
  pressedFor(side, n) { return !!this.p[this.versus && side === 1 ? P2[n] : n]; }
  // lee pulsaciones una vez por frame
  poll() {
    const JD = Phaser.Input.Keyboard.JustDown, k = this.keys;
    ['shoot', 'pass', 'switch', 'steal', 'block', 'pause', 'esc', 'help', 'enter', 'p2steal', 'p2block'].forEach(n => { this.p[n] = JD(k[n]); });
  }
  axis(side) {
    const k = this.keys, b = (d) => (d ? 1 : 0);
    if (this.versus) {
      return side === 1
        ? { x: b(k.aright.isDown) - b(k.aleft.isDown), y: b(k.adown.isDown) - b(k.aup.isDown) }
        : { x: b(k.right.isDown) - b(k.left.isDown), y: b(k.down.isDown) - b(k.up.isDown) };
    }
    return {
      x: b(k.right.isDown || k.aright.isDown) - b(k.left.isDown || k.aleft.isDown),
      y: b(k.down.isDown || k.adown.isDown) - b(k.up.isDown || k.aup.isDown)
    };
  }
  sprintFor(side) { return this.versus && side === 1 ? this.keys.p2run.isDown : this.keys.sprint.isDown; }
  act() {
    const sc = this.scene, m = sc.match;
    if (!this.versus && this.p.switch && sc.controlled && m.phase !== 'ft') { sc.cycleControlled(); Sfx.click(); }
    [0, 1].forEach(side => this.actPlayer(sc.controlledBy[side], side));
  }
  actPlayer(c, side) {
    if (!c || c.freeze) return;
    const sc = this.scene, m = sc.match, a = this.axis(side);
    c.setMove(a.x, a.y, this.sprintFor(side));
    if (m.phase !== 'live') return;
    if (this.pressedFor(side, 'shoot') && c.hasBall) m.attemptShot(c);
    if (!this.versus && this.p.pass && c.hasBall && c.shootTimer <= 0) this.doPass(c, a);
    if (this.pressedFor(side, 'steal')) m.attemptSteal(c);
    if (this.pressedFor(side, 'block')) c.startBlock();
  }
  doPass(c, a) {
    const sc = this.scene;
    const dir = (a.x || a.y) ? Math.atan2(a.y, a.x) : c.facing;
    let best = null, bs = 1e9;
    sc.players.forEach(t => {
      if (t.side !== c.side || t === c) return;
      const ang = Math.atan2(t.y - c.y, t.x - c.x);
      let da = Math.abs(ang - dir); if (da > Math.PI) da = 2 * Math.PI - da;
      const sco = da * 40 + Math.hypot(t.x - c.x, t.y - c.y) * 0.15 + (da > 1.2 ? 100 : 0);
      if (sco < bs) { bs = sco; best = t; }
    });
    if (best) { c.facing = Math.atan2(best.y - c.y, best.x - c.x); sc.ball.startPass(c, best); }
  }
}
