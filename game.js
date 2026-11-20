/**
 * Punto de entrada: configuración de Phaser y registro de escenas.
 * Phaser 3 se carga como script global desde index.html (CDN con respaldo local en /vendor).
 */
import { GAME_W, GAME_H, COLORS } from './src/config/constants.js';
import { installPixelText } from './src/ui/PixelText.js';
import { BootScene } from './src/scenes/BootScene.js';
import { MenuScene } from './src/scenes/MenuScene.js';
import { TeamSelectScene } from './src/scenes/TeamSelectScene.js';
import { SettingsScene } from './src/scenes/SettingsScene.js';
import { InstructionsScene } from './src/scenes/InstructionsScene.js';
import { GameScene } from './src/scenes/GameScene.js';
import { ResultScene } from './src/scenes/ResultScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_W,
  height: GAME_H,
  backgroundColor: COLORS.bg,
  pixelArt: true,
  roundPixels: true,
  disableContextMenu: true,
  fps: { target: 60 },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, MenuScene, TeamSelectScene, SettingsScene, InstructionsScene, GameScene, ResultScene]
};

/** Espera (máx. 1.5 s) a que cargue la fuente pixel y arranca el juego. */
async function boot() {
  try {
    await Promise.race([document.fonts.load('8px PixelNBA'), new Promise((r) => setTimeout(r, 1500))]);
  } catch (e) { /* si falla, se usa la fuente de respaldo */ }
  installPixelText();
  window.nbaGame = new Phaser.Game(config);
}

window.addEventListener('load', boot);

/*
┌──────────────────────────────────────┐
│        _.---._                       │
│      .'  ___  '.                     │
│     /   (o_o)   \     > Edison D.    │
│    |   /|___|\   |                   │
│    |  /_|_|_|_\  |     root@EdisonD  │
│     \    '-'    /                    │
│      '._  _  _.'                     │
└──────────────────────────────────────┘
*/
