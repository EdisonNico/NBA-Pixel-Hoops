import { FONT, GAME_W, MODES } from '../config/constants.js';
import { Sfx } from '../systems/AudioSystem.js';
import { Settings } from '../systems/SettingsStore.js';
import { teamById } from '../teams/teamsData.js';
import { drawBackdrop, drawTitle } from '../ui/Backdrop.js';
import { Button, MenuList } from '../ui/Button.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }
  create() {
    const S = Settings;
    drawBackdrop(this, S.get('team'));
    drawTitle(this, 'NBA PIXEL HOOPS', 40, 26);
    this.add.text(GAME_W / 2, 64, '- BASKETBALL ARCADE 5 vs 5 -', { fontFamily: FONT, fontSize: '9px', color: '#ffffff' }).setOrigin(0.5).setDepth(11);
    // balón rebotando
    const ball = this.add.image(120, 60, 'ball').setScale(3).setDepth(12);
    const ball2 = this.add.image(GAME_W - 120, 60, 'ball').setScale(3).setDepth(12);
    [ball, ball2].forEach((b, i) => this.tweens.add({ targets: b, y: 36, duration: 380, yoyo: true, repeat: -1, ease: 'Quad.easeOut', delay: i * 190 }));
    const mk = (y, label, cb) => new Button(this, GAME_W / 2, y, 250, 22, label, cb);
    const t = () => teamById(S.get('team')), r = () => teamById(S.get('rival'));
    const b = [];
    b.push(mk(100, 'JUGAR PARTIDO', () => { Sfx.unlock(); this.scene.start('Game'); }));
    b.push(mk(128, '', () => this.scene.start('TeamSelect', { which: 'team' })));
    b.push(mk(156, '', () => this.scene.start('TeamSelect', { which: 'rival' })));
    b.push(mk(184, '', () => { S.set('mode', (S.get('mode') + 1) % MODES.length); refresh(); }));
    b.push(mk(212, 'CONFIGURACION', () => this.scene.start('Settings')));
    b.push(mk(240, 'INSTRUCCIONES', () => this.scene.start('Instructions', { from: 'Menu' })));
    const refresh = () => {
      b[1].setLabel('EQUIPO: ' + t().city.toUpperCase().slice(0, 12) + ' ' + t().name.toUpperCase());
      b[2].setLabel('RIVAL: ' + r().abbr + ' ' + r().name.toUpperCase());
      b[3].setLabel('MODO: ' + MODES[S.get('mode')].name);
    };
    refresh();
    new MenuList(this, b);
    // enfrentamiento
    const tm = t(), rv = r();
    this.add.rectangle(GAME_W / 2 - 80, 285, 130, 22, parseInt(tm.main.slice(1), 16)).setStrokeStyle(1, 0xffffff).setDepth(10);
    this.add.rectangle(GAME_W / 2 + 80, 285, 130, 22, parseInt(rv.main.slice(1), 16)).setStrokeStyle(1, 0xffffff).setDepth(10);
    const st = { fontFamily: FONT, fontSize: '11px', fontStyle: 'bold', color: '#ffffff' };
    this.add.text(GAME_W / 2 - 80, 285, tm.name.toUpperCase(), st).setOrigin(0.5).setDepth(11);
    this.add.text(GAME_W / 2 + 80, 285, rv.name.toUpperCase(), st).setOrigin(0.5).setDepth(11);
    this.add.text(GAME_W / 2, 285, 'VS', Object.assign({}, st, { color: '#ffd23f', fontSize: '12px' })).setOrigin(0.5).setDepth(11);
    this.add.text(GAME_W / 2, 340, 'W/S o FLECHAS: mover   ENTER o CLICK: elegir', { fontFamily: FONT, fontSize: '8px', color: '#bbbbbb' }).setOrigin(0.5).setDepth(11);
  }
}
