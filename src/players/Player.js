// Jugador: sprite pixel art + estado de movimiento/acciones. La IA y el teclado solo fijan intenciones.

import { COURT } from '../config/constants.js';
import { ensurePlayer } from './PlayerSprites.js';
import { clamp } from '../utils/math.js';

export class Player {
  constructor(scene, team, side, idx, variant) {
    this.scene = scene; this.team = team; this.side = side; this.idx = idx;
    this.data = team.players[idx];
    this.base = ensurePlayer(scene, team, variant, idx);
    this.x = 0; this.y = 0; this.vx = 0; this.vy = 0;
    this.mx = 0; this.my = 0; this.sprint = false;   // intención de movimiento
    this.facing = 0;
    this.shootTimer = 0; this.shotType = 'jump'; this.shotHoop = null;
    this.blockTimer = 0; this.blockCD = 0; this.stealCD = 0; this.stunTimer = 0;
    this.freeze = false; this.outside = false;
    this.animT = 0; this.holdTime = 0;
    this.shadow = scene.add.image(0, 0, 'shadow').setDepth(1);
    this.sprite = scene.add.image(0, 0, this.base + '_idle').setOrigin(0.5, 1);
    this.maxSpeed = (52 + this.data.spd * 0.42) * 1.3 * scene.speedMul; // 1.3 = ritmo arcade
  }
  get hasBall() { return this.scene.ball.holder === this; }
  place(x, y) { this.x = x; this.y = y; this.vx = this.vy = 0; this.mx = this.my = 0; this.render(0); }
  setMove(mx, my, sprint) {
    const l = Math.hypot(mx, my);
    if (l > 1) { mx /= l; my /= l; }
    this.mx = mx; this.my = my; this.sprint = !!sprint;
  }
  moveToward(tx, ty, sprint, stop) {
    const dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy);
    if (d < (stop || 3)) return this.setMove(0, 0, false);
    const k = Math.min(1, d / 14);
    this.setMove(dx / d * k, dy / d * k, sprint);
  }
  // Lanzamiento con pequeña preparación (permite bloqueos). type: 'jump' | 'layup'
  startShot(hoop, type) {
    if (this.shootTimer > 0 || !this.hasBall) return false;
    this.shotHoop = hoop; this.shotType = type;
    this.shootTimer = type === 'layup' ? 0.34 : 0.3;
    this.shootDur = this.shootTimer;
    this.scene.ai.reactToShot(this);
    return true;
  }
  startBlock() {
    if (this.blockCD > 0 || this.blockTimer > 0 || this.shootTimer > 0) return false;
    this.blockTimer = 0.5; this.blockCD = 1.0; return true;
  }
  update(dt) {
    this.shootTimer = Math.max(0, this.shootTimer - dt);
    this.blockTimer = Math.max(0, this.blockTimer - dt);
    this.blockCD = Math.max(0, this.blockCD - dt);
    this.stealCD = Math.max(0, this.stealCD - dt);
    this.stunTimer = Math.max(0, this.stunTimer - dt);
    if (this.hasBall) this.holdTime += dt; else this.holdTime = 0;

    let tvx = 0, tvy = 0;
    if (!this.freeze && this.stunTimer <= 0) {
      let sp = this.maxSpeed * (this.sprint ? 1.4 : 1) * (this.hasBall ? 0.94 : 1);
      if (this.shootTimer > 0) sp *= 0.15;
      if (this.blockTimer > 0) sp *= 0.5;
      tvx = this.mx * sp; tvy = this.my * sp;
      if (this.shootTimer > 0 && this.shotType === 'layup' && this.shotHoop) {
        const dx = this.shotHoop.x - this.x, dy = this.shotHoop.y - this.y, d = Math.hypot(dx, dy) || 1;
        if (d > 14) { tvx = dx / d * 80; tvy = dy / d * 80; }
      }
    }
    const k = Math.min(1, 12 * dt);
    this.vx += (tvx - this.vx) * k; this.vy += (tvy - this.vy) * k;
    this.x += this.vx * dt; this.y += this.vy * dt;
    if (Math.hypot(this.vx, this.vy) > 8) this.facing = Math.atan2(this.vy, this.vx);

    if (!this.outside) {
      const C = COURT;
      this.x = clamp(this.x, C.x + 4, C.x + C.w - 4);
      this.y = clamp(this.y, C.y + 6, C.y + C.h - 2);
    }
    if (this.shootTimer === 0 && this.shootPending) { /* gestionado por MatchRules */ }
    this.animT += dt * (this.sprint ? 12 : 8);
    this.render(dt);
  }
  render() {
    const speed = Math.hypot(this.vx, this.vy);
    let frame = 'idle';
    let jz = 0;
    if (this.shootTimer > 0) {
      frame = 'up';
      const p = 1 - this.shootTimer / (this.shootDur || 0.3);
      jz = Math.sin(Math.min(1, p) * Math.PI) * (this.shotType === 'layup' ? 9 : 6);
    } else if (this.blockTimer > 0) {
      frame = 'up'; jz = Math.sin((1 - this.blockTimer / 0.5) * Math.PI) * 10;
    } else if (this.stealCD > 0.4) frame = 'wide';
    else if (speed > 12) frame = Math.floor(this.animT) % 2 ? 'run1' : 'run2';
    this.jz = jz;
    this.sprite.setTexture(this.base + '_' + frame);
    this.sprite.setPosition(Math.round(this.x), Math.round(this.y - jz));
    this.sprite.setDepth(this.y);
    this.shadow.setPosition(Math.round(this.x), Math.round(this.y - 1));
    this.shadow.setScale(1 - jz / 40);
  }
}
