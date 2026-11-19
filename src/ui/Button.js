// Botón arcade reutilizable (ratón + selección por teclado).

import { FONT } from '../config/constants.js';
import { Sfx } from '../systems/AudioSystem.js';

export class Button {
  constructor(scene, x, y, w, h, label, cb, opts) {
    this.scene = scene; this.cb = cb; this.w = w; this.h = h;
    opts = opts || {};
    this.color = opts.color || 0x1d3557; this.hot = opts.hot || 0xe63946;
    this.bg = scene.add.rectangle(x, y, w, h, this.color).setStrokeStyle(1, 0xffffff, 0.7).setDepth(20);
    this.text = scene.add.text(x, y, label, {
      fontFamily: FONT, fontSize: (opts.size || 11) + 'px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(21);
    this.bg.setInteractive({ useHandCursor: true });
    this.bg.on('pointerover', () => { if (this.onHover) this.onHover(); else this.setSelected(true); });
    this.bg.on('pointerout', () => { if (!this.keepSel) this.setSelected(false); });
    this.bg.on('pointerdown', () => this.activate());
  }
  setSelected(v) {
    this.selected = v;
    this.bg.setFillStyle(v ? this.hot : this.color);
    this.text.setColor(v ? '#ffd23f' : '#ffffff');
  }
  setLabel(t) { this.text.setText(t); }
  activate() { Sfx.click(); if (this.cb) this.cb(); }
  destroy() { this.bg.destroy(); this.text.destroy(); }
}

// Lista vertical de botones navegable con teclado
export class MenuList {
  constructor(scene, buttons) {
    this.scene = scene; this.buttons = buttons; this.i = 0;
    buttons.forEach((b, i) => { b.keepSel = true; b.onHover = () => this.select(i); });
    this.select(0);
    const kb = scene.input.keyboard;
    const nav = (d) => () => { this.select((this.i + d + buttons.length) % buttons.length); Sfx.move(); };
    kb.on('keydown-UP', nav(-1)); kb.on('keydown-W', nav(-1));
    kb.on('keydown-DOWN', nav(1)); kb.on('keydown-S', nav(1));
    kb.on('keydown-ENTER', () => this.buttons[this.i].activate());
    kb.on('keydown-SPACE', () => this.buttons[this.i].activate());
  }
  select(i) { this.i = i; this.buttons.forEach((b, k) => b.setSelected(k === i)); }
}
