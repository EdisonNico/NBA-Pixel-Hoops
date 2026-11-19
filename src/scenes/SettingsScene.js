import { DIFFS, FONT, GAME_W } from '../config/constants.js';
import { Sfx } from '../systems/AudioSystem.js';
import { Settings } from '../systems/SettingsStore.js';
import { drawBackdrop, drawTitle } from '../ui/Backdrop.js';
import { Button, MenuList } from '../ui/Button.js';
import { fmtClock } from '../utils/format.js';

export class SettingsScene extends Phaser.Scene {
  constructor() { super('Settings'); }
  create() {
    const S = Settings;
    drawBackdrop(this, S.get('team'), 0.8);
    drawTitle(this, 'CONFIGURACION', 36, 22);
    const QS = [0, 60, 120, 180, 300];
    const qLabel = q => q === 0 ? 'SEGUN MODO' : fmtClock(q) + ' REAL';
    const rows = [
      { get: () => 'DURACION CUARTO: ' + qLabel(S.get('quarter')), change: d => { const i = (QS.indexOf(S.get('quarter')) + d + QS.length) % QS.length; S.set('quarter', QS[i]); } },
      { get: () => 'DIFICULTAD CPU: ' + DIFFS[S.get('diff')], change: d => S.set('diff', (S.get('diff') + d + 3) % 3) },
      { get: () => 'SONIDO: ' + (S.get('sound') ? 'SI' : 'NO'), change: () => S.set('sound', !S.get('sound')) },
      { get: () => 'VOLUMEN: ' + Math.round(S.get('volume') * 100) + '%', change: d => { let v = Math.round(S.get('volume') * 10) + d; if (v > 10) v = 0; if (v < 0) v = 10; S.set('volume', v / 10); } },
      { get: () => 'AYUDA EN PARTIDO: ' + (S.get('hints') ? 'SI' : 'NO'), change: () => S.set('hints', !S.get('hints')) },
      { get: () => 'PANTALLA COMPLETA: ' + (this.scale.isFullscreen ? 'SI' : 'NO'), change: () => (this.scale.isFullscreen ? this.scale.stopFullscreen() : this.scale.startFullscreen()) }
    ];
    // el estado de pantalla completa cambia de forma asíncrona: se refresca la etiqueta dos veces
    const refresh = i => {
      btns[i].setLabel(rows[i].get());
      this.time.delayedCall(300, () => { if (btns[i].text.active) btns[i].setLabel(rows[i].get()); });
    };
    const btns = rows.map((r, i) => new Button(this, GAME_W / 2, 90 + i * 31, 300, 24, r.get(), () => { r.change(1); refresh(i); Sfx.click(); }));
    btns.push(new Button(this, GAME_W / 2, 90 + rows.length * 32 + 4, 300, 24, 'VOLVER', () => this.scene.start('Menu')));
    const menu = new MenuList(this, btns);
    const kb = this.input.keyboard;
    const adj = d => () => { const i = menu.i; if (rows[i]) { rows[i].change(d); refresh(i); Sfx.move(); } };
    kb.on('keydown-LEFT', adj(-1)); kb.on('keydown-RIGHT', adj(1)); kb.on('keydown-A', adj(-1)); kb.on('keydown-D', adj(1));
    kb.on('keydown-ESC', () => this.scene.start('Menu'));
    this.add.text(GAME_W / 2, 335, 'IZQ/DER: cambiar valor   ESC: volver', { fontFamily: FONT, fontSize: '8px', color: '#bbbbbb' }).setOrigin(0.5).setDepth(11);
  }
}
