/** Fondo completo: gradas con público, parquet, líneas reglamentarias, aros y logo del equipo local. */

import { CORNER_DY, COURT, FONT, GAME_H, GAME_W, HOOPS, PAINT_HALF, PAINT_LEN, THREE_R } from '../config/constants.js';
import { R, arcPx, canvasTex, createRng } from '../utils/canvas.js';
import { shade } from '../utils/math.js';

export function ensureCourt(scene, team) {
  const key = 'court_' + team.id;
  return canvasTex(scene, key, GAME_W, GAME_H, c => {
    const rnd = createRng(11);
    const C = COURT;
    R(c, 0, 0, GAME_W, GAME_H, shade(team.main, -70));
    // superficie roja/colores del equipo alrededor de la cancha
    R(c, 0, 28, GAME_W, GAME_H - 28, shade(team.main, -15));
    // gradas
    const crowd = (x0, y0, w, h) => {
      R(c, x0, y0, w, h, '#1b1b2b');
      for (let y = y0; y + 8 <= y0 + h; y += 8) {
        for (let x = x0 + ((y / 8) % 2) * 4; x + 6 <= x0 + w; x += 8) {
          const skins = ['#f1c27d', '#c68642', '#8d5524', '#5c3a1e', '#e0ac69'];
          const shirts = [team.main, team.trim, '#ffffff', '#3a86ff', '#222222', '#e63946', '#8338ec'];
          R(c, x + 1, y + 4, 5, 4, shirts[Math.floor(rnd() * shirts.length)]);
          R(c, x + 1, y, 4, 4, skins[Math.floor(rnd() * skins.length)]);
          R(c, x + 1, y, 4, 1, ['#111', '#3b2314', '#caa24a', '#222'][Math.floor(rnd() * 4)]);
        }
      }
    };
    crowd(0, 28, GAME_W, 36);
    crowd(0, C.y + C.h + 8, GAME_W, GAME_H - (C.y + C.h + 8));
    crowd(0, C.y - 8, 34, C.h + 16);
    crowd(GAME_W - 34, C.y - 8, 34, C.h + 16);
    // parquet
    R(c, C.x, C.y, C.w, C.h, '#d9a066');
    for (let x = C.x; x < C.x + C.w; x += 10) {
      R(c, x, C.y, 10, C.h, ((x - C.x) / 10) % 2 ? '#dca56c' : '#d39a5e');
      R(c, x, C.y, 1, C.h, '#bf8750');
      for (let y = C.y + Math.floor(rnd() * 30); y < C.y + C.h; y += 30 + Math.floor(rnd() * 30)) R(c, x, y, 10, 1, '#b9824d');
    }
    // pintura (zona) con color del equipo
    const line = '#2a1a12';
    const ends = [HOOPS.left, HOOPS.right];
    ends.forEach(h => {
      const inw = -h.dir, bx = h.dir < 0 ? C.x : C.x + C.w;
      const px = inw > 0 ? bx : bx - PAINT_LEN;
      c.globalAlpha = 0.55; R(c, px, C.cy - PAINT_HALF, PAINT_LEN, PAINT_HALF * 2, team.main); c.globalAlpha = 1;
      R(c, px, C.cy - PAINT_HALF, PAINT_LEN, 1, line); R(c, px, C.cy + PAINT_HALF, PAINT_LEN, 1, line);
      const fx = bx + inw * PAINT_LEN;
      R(c, fx, C.cy - PAINT_HALF, 1, PAINT_HALF * 2 + 1, line);
      // círculo de tiro libre (mitad exterior)
      const a0 = inw > 0 ? -Math.PI / 2 : Math.PI / 2;
      arcPx(c, fx, C.cy, 24, a0, a0 + Math.PI, line);
      // arco de tres
      const lim = Math.asin(CORNER_DY / THREE_R);
      const mid = inw > 0 ? 0 : Math.PI;
      arcPx(c, h.x, h.y, THREE_R, mid - lim, mid + lim, line);
      const cornerX = h.x + inw * Math.sqrt(THREE_R * THREE_R - CORNER_DY * CORNER_DY);
      const x1 = Math.min(bx, cornerX), x2 = Math.max(bx, cornerX);
      R(c, x1, C.cy - CORNER_DY, x2 - x1, 1, line); R(c, x1, C.cy + CORNER_DY, x2 - x1, 1, line);
      // semicírculo restringido
      arcPx(c, h.x, h.y, 14, mid - Math.PI / 2, mid + Math.PI / 2, line);
      // tablero y soporte
      const bxn = h.dir < 0 ? C.x + 8 : C.x + C.w - 10;
      R(c, bxn - 1, C.cy - 14, 4, 28, '#222');
      R(c, bxn, C.cy - 13, 2, 26, '#e8eef5');
      const sx = Math.min(bxn + 2, h.x), sw = Math.abs(h.x - bxn) - 2;
      R(c, h.dir < 0 ? bxn + 2 : h.x, C.cy, Math.max(1, sw), 1, '#ff5a00');
    });
    // líneas generales
    R(c, C.x, C.y, C.w, 1, line); R(c, C.x, C.y + C.h - 1, C.w, 1, line);
    R(c, C.x, C.y, 1, C.h, line); R(c, C.x + C.w - 1, C.y, 1, C.h, line);
    R(c, C.cx, C.y, 1, C.h, line);
    arcPx(c, C.cx, C.cy, 26, 0, Math.PI * 2, line);
    arcPx(c, C.cx, C.cy, 8, 0, Math.PI * 2, line);
    // logo
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = shade(team.main, -10); c.beginPath(); c.arc(C.cx, C.cy, 18, 0, Math.PI * 2); c.fill();
    c.font = 'bold 11px ' + FONT; c.fillStyle = team.trim;
    c.fillText(team.abbr, C.cx, C.cy - 3);
    c.font = 'bold 6px ' + FONT; c.fillStyle = '#ffffff';
    c.fillText(team.name.toUpperCase().slice(0, 9), C.cx, C.cy + 7);
  });
}
