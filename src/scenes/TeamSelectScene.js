import { FONT, GAME_W } from '../config/constants.js';
import { ensurePlayer } from '../players/PlayerSprites.js';
import { Sfx } from '../systems/AudioSystem.js';
import { Settings } from '../systems/SettingsStore.js';
import { TEAMS } from '../teams/teamsData.js';
import { drawBackdrop, drawTitle } from '../ui/Backdrop.js';
import { Button } from '../ui/Button.js';

export class TeamSelectScene extends Phaser.Scene {
  constructor() { super('TeamSelect'); }
  init(data) { this.which = (data && data.which) || 'team'; }
  create() {
    const S = Settings, other = this.which === 'team' ? 'rival' : 'team';
    drawBackdrop(this, S.get('team'), 0.8);
    drawTitle(this, this.which === 'team' ? 'ELIGE TU EQUIPO' : 'ELIGE AL RIVAL', 22, 18);
    this.sel = Math.max(0, TEAMS.findIndex(t => t.id === S.get(this.which)));
    this.otherId = S.get(other);
    this.cards = [];
    const cw = 140, ch = 50, gap = 8, x0 = (GAME_W - 4 * cw - 3 * gap) / 2 + cw / 2;
    TEAMS.forEach((t, i) => {
      const x = x0 + (i % 4) * (cw + gap), y = 70 + Math.floor(i / 4) * (ch + gap);
      const col = parseInt(t.main.slice(1), 16);
      const rect = this.add.rectangle(x, y, cw, ch, col).setStrokeStyle(2, 0xffffff, 0.4).setDepth(10).setInteractive({ useHandCursor: true });
      const ab = this.add.text(x, y - 8, t.abbr, { fontFamily: FONT, fontSize: '16px', fontStyle: 'bold', color: t.trim }).setOrigin(0.5).setDepth(11);
      const nm = this.add.text(x, y + 12, t.name.toUpperCase(), { fontFamily: FONT, fontSize: '9px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5).setDepth(11);
      const tag = this.add.text(x + cw / 2 - 3, y - ch / 2 + 2, t.id === this.otherId ? (other === 'rival' ? 'RIVAL' : 'TU EQUIPO') : '', { fontFamily: FONT, fontSize: '7px', color: '#ffd23f', backgroundColor: '#000' }).setOrigin(1, 0).setDepth(12);
      rect.on('pointerdown', () => { this.sel = i; Sfx.click(); this.refresh(); });
      this.cards.push({ rect, ab, nm, tag });
    });
    this.roster = [];
    this.hint = this.add.text(GAME_W / 2, 332, '', { fontFamily: FONT, fontSize: '8px', color: '#ffd23f' }).setOrigin(0.5).setDepth(12);
    const ok = new Button(this, GAME_W / 2 - 70, 316, 120, 20, 'ACEPTAR', () => this.accept(), { size: 10 });
    const bk = new Button(this, GAME_W / 2 + 70, 316, 120, 20, 'VOLVER', () => this.scene.start('Menu'), { size: 10 });
    const kb = this.input.keyboard;
    const mv = (dx, dy) => () => {
      let i = this.sel; const c = i % 4, r = Math.floor(i / 4);
      const nc = (c + dx + 4) % 4, nr = (r + dy + 2) % 2;
      this.sel = nr * 4 + nc; Sfx.move(); this.refresh();
    };
    kb.on('keydown-LEFT', mv(-1, 0)); kb.on('keydown-A', mv(-1, 0));
    kb.on('keydown-RIGHT', mv(1, 0)); kb.on('keydown-D', mv(1, 0));
    kb.on('keydown-UP', mv(0, -1)); kb.on('keydown-W', mv(0, -1));
    kb.on('keydown-DOWN', mv(0, 1)); kb.on('keydown-S', mv(0, 1));
    kb.on('keydown-ENTER', () => this.accept());
    kb.on('keydown-ESC', () => this.scene.start('Menu'));
    this.refresh();
  }
  refresh() {
    this.cards.forEach((c, i) => c.rect.setStrokeStyle(i === this.sel ? 3 : 2, i === this.sel ? 0xffd23f : 0xffffff, i === this.sel ? 1 : 0.4).setScale(i === this.sel ? 1.04 : 1));
    this.roster.forEach(o => o.destroy()); this.roster = [];
    const t = TEAMS[this.sel];
    this.cards.forEach((c, i) => c.tag.setAlpha(1));
    const lbl = this.add.text(GAME_W / 2, 150, t.city.toUpperCase() + ' ' + t.name.toUpperCase() + ' - QUINTETO', { fontFamily: FONT, fontSize: '10px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5).setDepth(11);
    this.roster.push(lbl);
    t.players.forEach((p, i) => {
      const x = 70 + i * 125;
      const key = ensurePlayer(this, t, 'main', i) + '_idle';
      this.roster.push(this.add.rectangle(x, 218, 112, 98, 0x0b1530, 0.85).setStrokeStyle(1, parseInt(t.main.slice(1), 16)).setDepth(10));
      this.roster.push(this.add.image(x, 202, key).setScale(3).setDepth(12));
      this.roster.push(this.add.text(x, 232, p.name.split(' ').slice(-1)[0].toUpperCase().slice(0, 11), { fontFamily: FONT, fontSize: '9px', fontStyle: 'bold', color: '#ffd23f' }).setOrigin(0.5).setDepth(12));
      this.roster.push(this.add.text(x, 244, '#' + p.num + ' ' + p.pos, { fontFamily: FONT, fontSize: '8px', color: '#ffffff' }).setOrigin(0.5).setDepth(12));
      const ovr = Math.round((p.spd + p.sho + p.thr + p.pas + p.def) / 5);
      this.roster.push(this.add.text(x, 256, 'OVR ' + ovr + ' 3PT ' + p.thr, { fontFamily: FONT, fontSize: '8px', color: '#9be7ff' }).setOrigin(0.5).setDepth(12));
      this.roster.push(this.add.text(x, 268, 'VEL ' + p.spd + ' DEF ' + p.def, { fontFamily: FONT, fontSize: '8px', color: '#9be7ff' }).setOrigin(0.5).setDepth(12));
    });
    const same = t.id === this.otherId;
    this.hint.setText(same ? 'Ese equipo ya esta elegido: el otro cambiara automaticamente' : '');
  }
  accept() {
    const S = Settings, t = TEAMS[this.sel], other = this.which === 'team' ? 'rival' : 'team';
    S.set(this.which, t.id);
    if (S.get(other) === t.id) {
      const alt = TEAMS.find(x => x.id !== t.id);
      S.set(other, alt.id);
    }
    Sfx.click();
    this.scene.start('Menu');
  }
}
