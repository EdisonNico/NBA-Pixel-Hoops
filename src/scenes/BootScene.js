import { Sfx } from '../systems/AudioSystem.js';
import { ensureBall, ensureRim, ensureShadow } from '../systems/TextureFactory.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    ensureBall(this); ensureShadow(this); ensureRim(this);
    const g = this.add.graphics();
    g.fillStyle(0xffd23f, 1).fillTriangle(0, 0, 8, 0, 4, 5); g.generateTexture('marker', 8, 6); g.destroy();
    Sfx.unlock();
    this.scene.start('Menu');
  }
}
