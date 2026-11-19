/** Texturas procedurales pequeñas: balón, sombra y aro (sin archivos de imagen). */

import { P, arcPx, canvasTex } from '../utils/canvas.js';

export function ensureBall(scene) {
  return canvasTex(scene, 'ball', 7, 7, c => {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const d = Math.hypot(x - 3, y - 3);
      if (d > 3.4) continue;
      let col = '#f08a24';
      if (d > 2.7) col = '#7a3208';
      else if (x === 3 || y === 3) col = '#6b2a0a';
      else if (x === 2 && y === 2) col = '#ffc27a';
      P(c, x, y, col);
    }
  });
}

export function ensureShadow(scene) {
  return canvasTex(scene, 'shadow', 14, 6, c => {
    c.fillStyle = 'rgba(0,0,0,0.35)';
    c.beginPath(); c.ellipse(7, 3, 6.5, 2.6, 0, 0, Math.PI * 2); c.fill();
  });
}

export function ensureRim(scene) {
  return canvasTex(scene, 'rim', 22, 22, c => {
    arcPx(c, 11, 11, 7, 0, Math.PI * 2, '#ff5a00');
    arcPx(c, 11, 11, 6, 0, Math.PI * 2, '#ff8a3d');
    for (let a = 0; a < 8; a++) {
      const an = a * Math.PI / 4;
      P(c, 11 + Math.cos(an) * 4, 11 + Math.sin(an) * 4, 'rgba(255,255,255,0.7)');
    }
    P(c, 11, 11, 'rgba(255,255,255,0.5)');
  });
}
