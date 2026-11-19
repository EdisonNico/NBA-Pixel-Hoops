import { FONT, GAME_W } from '../config/constants.js';
import { Settings } from '../systems/SettingsStore.js';
import { drawBackdrop, drawTitle } from '../ui/Backdrop.js';
import { Button } from '../ui/Button.js';
import { CONTROLS_P2 } from '../config/controls.js';
import { drawControls } from '../ui/ControlsPanel.js';

export class InstructionsScene extends Phaser.Scene {
  constructor() { super('Instructions'); }
  init(d) { this.from = (d && d.from) || 'Menu'; }
  create() {
    drawBackdrop(this, Settings.get('team'), 0.82);
    drawTitle(this, 'INSTRUCCIONES', 26, 22);
    drawControls(this, 40, 56, 16, 10);
    this.add.text(350, 56, 'MODO 1 VS 1 (JUGADOR 2)', { fontFamily: FONT, fontSize: '10px', fontStyle: 'bold', color: '#66ddff' }).setDepth(10);
    drawControls(this, 350, 76, 16, 10, CONTROLS_P2);
    this.add.text(350, 160, 'En 1 vs 1 el jugador 1 usa solo W A S D y\nel jugador 2 las flechas (mismo teclado).', { fontFamily: FONT, fontSize: '8px', color: '#cfe8ff' }).setDepth(10);
    const st = { fontFamily: FONT, fontSize: '9px', color: '#cfe8ff', wordWrap: { width: 520 } };
    this.add.text(60, 214, 'REGLAS: 4 cuartos, triples (+3) fuera del arco, tiros libres con barra: pulsa ESPACIO cuando el cursor este en la zona verde. 24 segundos de posesion. Si hay empate se juega tiempo extra. Los fallos al robar o bloquear pueden ser falta.', st).setDepth(10);
    this.add.text(60, 262, 'CONSEJOS: acercate al aro para bandejas (mas faciles). Un defensor cerca reduce el porcentaje. Usa Q para controlar al defensor mas cercano al balon.', st).setDepth(10);
    new Button(this, GAME_W / 2, 322, 140, 22, 'VOLVER', () => this.scene.start(this.from)).setSelected(true);
    this.input.keyboard.on('keydown-ESC', () => this.scene.start(this.from));
    this.input.keyboard.on('keydown-ENTER', () => this.scene.start(this.from));
  }
}
