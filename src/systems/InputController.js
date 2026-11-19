// Teclado: W A S D mover, SHIFT correr, ESPACIO tirar, E pasar, Q cambiar, R robar, F bloquear.

import { Sfx } from './AudioSystem.js';

export class InputController {
  constructor(scene) {
    this.scene = scene;
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      up: K.W, down: K.S, left: K.A, right: K.D, aup: K.UP, adown: K.DOWN, aleft: K.LEFT, aright: K.RIGHT,
      shoot: K.SPACE, pass: K.E, switch: K.Q, sprint: K.SHIFT, steal: K.R, block: K.F,
      pause: K.P, esc: K.ESC, help: K.H
    });
    this.p = {};
    scene.input.keyboard.addCapture([K.SPACE, K.UP, K.DOWN, K.LEFT, K.RIGHT]);
  }
  pressed(n) { return !!this.p[n]; }
  // lee pulsaciones una vez por frame
  poll() {
    const JD = Phaser.Input.Keyboard.JustDown, k = this.keys;
    ['shoot', 'pass', 'switch', 'steal', 'block', 'pause', 'esc', 'help'].forEach(n => { this.p[n] = JD(k[n]); });
  }
  axis() {
    const k = this.keys;
    return {
      x: ((k.right.isDown || k.aright.isDown) ? 1 : 0) - ((k.left.isDown || k.aleft.isDown) ? 1 : 0),
      y: ((k.down.isDown || k.adown.isDown) ? 1 : 0) - ((k.up.isDown || k.aup.isDown) ? 1 : 0)
    };
  }
  act() {
    const sc = this.scene, m = sc.match, c = sc.controlled, b = sc.ball;
    if (!c) return;
    if (this.p.switch && m.phase !== 'ft') { sc.cycleControlled(); Sfx.click(); }
    if (c.freeze) return;
    const a = this.axis();
    c.setMove(a.x, a.y, this.keys.sprint.isDown);
    if (m.phase !== 'live') return;
    if (this.p.shoot && c.hasBall) m.attemptShot(c);
    if (this.p.pass && c.hasBall && c.shootTimer <= 0) this.doPass(c, a);
    if (this.p.steal) m.attemptSteal(c);
    if (this.p.block) c.startBlock();
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
