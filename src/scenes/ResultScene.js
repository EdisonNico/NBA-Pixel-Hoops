import { FONT, GAME_W } from '../config/constants.js';
import { Sfx } from '../systems/AudioSystem.js';
import { drawBackdrop, drawTitle } from '../ui/Backdrop.js';
import { Button, MenuList } from '../ui/Button.js';
import { readableOn } from '../utils/color.js';

export class ResultScene extends Phaser.Scene {
  constructor() { super('Result'); }
  init(d) { this.d = d; }
  create() {
    const d = this.d, win = d.score[0] > d.score[1];
    drawBackdrop(this, d.teams[0].id, 0.78);
    Sfx[win ? 'win' : 'lose']();
    const t = drawTitle(this, d.versus ? (win ? 'GANA JUGADOR 1' : 'GANA JUGADOR 2') : (win ? 'VICTORIA!' : 'DERROTA'), 40, d.versus ? 26 : 34);
    t.setColor(win || d.versus ? '#ffd23f' : '#ff5a5a');
    this.tweens.add({ targets: t, scale: 1.1, duration: 500, yoyo: true, repeat: -1 });
    const st = (s, c) => ({ fontFamily: FONT, fontSize: s + 'px', fontStyle: 'bold', color: c || '#ffffff' });
    this.add.text(GAME_W / 2 - 110, 90, d.teams[0].name.toUpperCase(), st(12, readableOn('#0a0f1e', d.teams[0].trim))).setOrigin(0.5).setDepth(11);
    this.add.text(GAME_W / 2 + 110, 90, d.teams[1].name.toUpperCase(), st(12)).setOrigin(0.5).setDepth(11);
    this.add.text(GAME_W / 2 - 110, 124, String(d.score[0]), st(30, '#ffd23f')).setOrigin(0.5).setDepth(11);
    this.add.text(GAME_W / 2 + 110, 124, String(d.score[1]), st(30)).setOrigin(0.5).setDepth(11);
    this.add.text(GAME_W / 2, 124, d.ot ? 'FINAL (OT)' : 'FINAL', st(10, '#bbbbbb')).setOrigin(0.5).setDepth(11);
    const s = d.stats, pct = (a, b) => b ? Math.round(100 * a / b) + '%' : '0%';
    const rows = [
      ['TIROS DE CAMPO', s[0].fgm + '/' + s[0].fga + ' ' + pct(s[0].fgm, s[0].fga), s[1].fgm + '/' + s[1].fga + ' ' + pct(s[1].fgm, s[1].fga)],
      ['TRIPLES', s[0].tpm + '/' + s[0].tpa, s[1].tpm + '/' + s[1].tpa],
      ['TIROS LIBRES', s[0].ftm + '/' + s[0].fta, s[1].ftm + '/' + s[1].fta],
      ['ROBOS', s[0].stl, s[1].stl], ['BLOQUEOS', s[0].blk, s[1].blk], ['FALTAS', s[0].foul, s[1].foul]
    ];
    rows.forEach((r, i) => {
      const y = 156 + i * 16;
      this.add.text(GAME_W / 2 - 110, y, String(r[1]), st(10)).setOrigin(0.5).setDepth(11);
      this.add.text(GAME_W / 2, y, r[0], st(9, '#9be7ff')).setOrigin(0.5).setDepth(11);
      this.add.text(GAME_W / 2 + 110, y, String(r[2]), st(10)).setOrigin(0.5).setDepth(11);
    });
    const top = d.scorers.slice().sort((a, b) => b.pts - a.pts)[0];
    if (top) this.add.text(GAME_W / 2, 262, 'MVP: ' + top.name.toUpperCase() + ' (' + top.pts + ' PTS)', st(11, '#ffd23f')).setOrigin(0.5).setDepth(11);
    const b = [
      new Button(this, GAME_W / 2 - 80, 300, 140, 24, 'REVANCHA', () => this.scene.start('Game')),
      new Button(this, GAME_W / 2 + 80, 300, 140, 24, 'MENU PRINCIPAL', () => this.scene.start('Menu'))
    ];
    const kb = this.input.keyboard, m = new MenuList(this, b);
    kb.on('keydown-LEFT', () => m.select(0)); kb.on('keydown-RIGHT', () => m.select(1));
    kb.on('keydown-A', () => m.select(0)); kb.on('keydown-D', () => m.select(1));
  }
}
