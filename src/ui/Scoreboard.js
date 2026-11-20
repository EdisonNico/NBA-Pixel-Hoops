// Marcador digital superior, avisos centrales y medidor de tiros libres.

import { FONT, GAME_W } from '../config/constants.js';
import { readableOn } from '../utils/color.js';

const css = (n) => '#' + n.toString(16).padStart(6, '0');
export class Scoreboard {
  constructor(scene, teams) {
    this.scene = scene;
    const D = 1000, st = (size, col) => ({ fontFamily: FONT, fontSize: size + 'px', color: col || '#fff', fontStyle: 'bold' });
    const hex = s => parseInt(s.slice(1), 16);
    this.g = scene.add.graphics().setDepth(D);
    const x0 = 120, y0 = 2, w = 400, h = 24;
    this.g.fillStyle(0x0b1530, 1).fillRect(x0, y0, w, h).lineStyle(2, 0x2a5fb0, 1).strokeRect(x0, y0, w, h);
    this.g.fillStyle(hex(teams[0].main), 1).fillRect(x0 + 3, y0 + 3, 130, h - 6);
    this.g.fillStyle(hex(teams[1].main), 1).fillRect(x0 + 137, y0 + 3, 130, h - 6);
    this.g.fillStyle(0x151a33, 1).fillRect(x0 + 271, y0 + 3, 90, h - 6);
    this.g.fillStyle(0x300a0a, 1).fillRect(x0 + 365, y0 + 3, 32, h - 6);
    const T = (x, y, t, s, c, o) => scene.add.text(x, y, t, st(s, c)).setOrigin(o === undefined ? 0.5 : o, 0.5).setDepth(D + 1);
    T(x0 + 10, 14, teams[0].abbr, 12, readableOn(teams[0].main, teams[0].trim), 0);
    this.s0 = T(x0 + 126, 14, '0', 13, '#fff', 1);
    T(x0 + 144, 14, teams[1].abbr, 12, teams[1].altTrim === teams[1].main ? '#fff' : '#fff', 0);
    this.s1 = T(x0 + 260, 14, '0', 13, '#fff', 1);
    this.q = T(x0 + 292, 14, '1ER', 10, '#ffd23f');
    this.clock = T(x0 + 334, 14, '12:00', 10, '#ffffff');
    this.sc = T(x0 + 381, 14, '24', 12, '#ff4d4d');
    // aviso central
    this.ban = scene.add.text(GAME_W / 2, 48, '', Object.assign(st(16, '#ffd23f'), { stroke: '#000', strokeThickness: 4 })).setOrigin(0.5).setDepth(D + 2).setAlpha(0);
    // jugador controlado
    this.who = scene.add.text(8, 334, '', Object.assign(st(9, '#ffd23f'), { stroke: '#000', strokeThickness: 3 })).setDepth(D + 2);
    // medidor de tiros libres
    this.mg = scene.add.graphics().setDepth(D + 3);
    this.mt = scene.add.text(GAME_W / 2, 292, '', Object.assign(st(9, '#fff'), { stroke: '#000', strokeThickness: 3 })).setOrigin(0.5).setDepth(D + 3);
  }
  set(m) {
    this.s0.setText(String(m.score[0])); this.s1.setText(String(m.score[1]));
    this.q.setText(m.ot ? 'OT' : ['1ER', '2DO', '3ER', '4TO'][m.quarter - 1]);
    this.clock.setText(m.displayClock());
    this.sc.setText(String(Math.max(0, Math.ceil(m.shotClock))).padStart(2, '0'));
    this.sc.setColor(m.shotClock < 5 ? '#ff4d4d' : '#ff9a9a');
  }
  setPlayer(p) { this.who.setText(p ? ('#' + p.data.num + ' ' + p.data.name.toUpperCase()) : ''); }
  banner(text, color, ms) {
    this.ban.setText(text).setColor(color || '#ffd23f').setAlpha(1).setScale(1.4);
    this.scene.tweens.killTweensOf(this.ban);
    this.scene.tweens.add({ targets: this.ban, scale: 1, duration: 150 });
    this.scene.tweens.add({ targets: this.ban, alpha: 0, delay: ms || 1000, duration: 300 });
  }
  ftMeter(v, w, label) {
    this.mg.clear();
    if (v === null || v === undefined) { this.mt.setText(''); return; }
    const x = GAME_W / 2 - 60, y = 302, W = 120, H = 8;
    this.mg.fillStyle(0x000000, 0.8).fillRect(x - 2, y - 2, W + 4, H + 4);
    this.mg.fillStyle(0x7a1f1f, 1).fillRect(x, y, W, H);
    this.mg.fillStyle(0x2ecc71, 1).fillRect(x + (0.5 - w) * W, y, w * 2 * W, H);
    this.mg.fillStyle(0xffffff, 1).fillRect(x + v * W - 1, y - 3, 3, H + 6);
    this.mt.setText(label || '');
  }
}
