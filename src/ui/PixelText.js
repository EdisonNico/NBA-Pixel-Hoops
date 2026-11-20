import { FONT } from '../config/constants.js';

/** Ajusta el tamaño a un múltiplo de 8 px: la fuente pixel solo se ve nítida así. */
export const snapSize = (px) => (px <= 11 ? 8 : Math.max(16, Math.round(px / 8) * 8));

/**
 * Hace que TODOS los textos del juego (`scene.add.text`) usen la fuente pixel:
 * fuerza la familia, quita la negrita (que emborrona los píxeles), ajusta el tamaño
 * y añade una sombra dura (1-2 px) para que se lea sobre cualquier fondo.
 * Se llama una sola vez, antes de crear el juego.
 */
export function installPixelText() {
  const factory = Phaser.GameObjects.GameObjectFactory.prototype;
  if (factory.__pixelText) return;
  const original = factory.text;
  factory.text = function (x, y, text, style) {
    const s = Object.assign({}, style);
    s.fontFamily = FONT;
    s.fontStyle = 'normal';
    const size = snapSize(parseInt(s.fontSize, 10) || 8);
    s.fontSize = size + 'px';
    delete s.stroke; delete s.strokeThickness; // el contorno redondeado emborrona los píxeles
    const t = original.call(this, x, y, text, s);
    if (!s.backgroundColor) { const o = size >= 16 ? 2 : 1; t.setShadow(o, o, '#000000', 0, false, true); }
    return t;
  };
  factory.__pixelText = true;
}
