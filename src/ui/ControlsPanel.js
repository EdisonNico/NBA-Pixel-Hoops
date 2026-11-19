import { FONT } from '../config/constants.js';
import { CONTROLS } from '../config/controls.js';

/** Dibuja la tabla de controles. Devuelve los textos creados (para mostrarlos/ocultarlos). */
export function drawControls(scene, x, y, step, depth) {
  const out = [];
  CONTROLS.forEach((c, i) => {
    out.push(scene.add.text(x, y + i * step, c[0], { fontFamily: FONT, fontSize: '10px', fontStyle: 'bold', color: '#ffd23f' }).setDepth(depth));
    out.push(scene.add.text(x + 90, y + i * step, c[1], { fontFamily: FONT, fontSize: '10px', color: '#ffffff' }).setDepth(depth));
  });
  return out;
}
