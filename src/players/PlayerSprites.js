/** Sprites pixel art de los jugadores generados por código (camiseta, dorsal, peinado). */

import { P, R, canvasTex } from '../utils/canvas.js';
import { shade } from '../utils/math.js';

const DIGITS = {
  '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'],
  '2': ['111', '001', '111', '100', '111'], '3': ['111', '001', '111', '001', '111'],
  '4': ['101', '101', '111', '001', '001'], '5': ['111', '100', '111', '001', '111'],
  '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'],
  '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111']
};

/** Genera (si no existen) los frames de un jugador: idle, run1, run2, up, wide. */
export function ensurePlayer(scene, team, variant, idx) {
  const pl = team.players[idx];
  const main = variant === 'alt' ? team.altMain : team.main;
  const trim = variant === 'alt' ? team.altTrim : team.trim;
  const base = 'pl_' + team.id + '_' + variant + '_' + idx;
  ['idle', 'run1', 'run2', 'up', 'wide'].forEach(frame => {
    canvasTex(scene, base + '_' + frame, 14, 20, c => drawPlayer(c, pl, main, trim, frame));
  });
  return base;
}

function drawPlayer(c, pl, main, trim, frame) {
  const skin = pl.skin, hair = pl.hair;
  const dark = shade(main, -35);
  const skinD = shade(skin, -30);
  // brazos
  const armsUp = frame === 'up', wide = frame === 'wide';
  if (armsUp) { R(c, 2, 2, 2, 7, skin); R(c, 10, 2, 2, 7, skin); }
  else if (wide) { R(c, 0, 8, 3, 2, skin); R(c, 11, 8, 3, 2, skin); }
  else if (frame === 'run1') { R(c, 2, 7, 2, 5, skin); R(c, 10, 9, 2, 5, skin); }
  else if (frame === 'run2') { R(c, 2, 9, 2, 5, skin); R(c, 10, 7, 2, 5, skin); }
  else { R(c, 2, 8, 2, 6, skin); R(c, 10, 8, 2, 6, skin); }
  // camiseta
  R(c, 3, 7, 8, 7, main);
  R(c, 3, 13, 8, 1, trim);
  R(c, 5, 7, 4, 1, trim);
  // dorsal
  const num = String(pl.num);
  const w = num.length * 4 - 1;
  let ox = Math.floor((14 - w) / 2);
  for (const ch of num) {
    const g = DIGITS[ch];
    for (let y = 0; y < 5; y++) for (let x = 0; x < 3; x++) if (g[y][x] === '1') P(c, ox + x, 8 + y, trim);
    ox += 4;
  }
  // pantalón
  R(c, 3, 14, 8, 3, dark);
  R(c, 3, 14, 1, 3, trim);
  // piernas
  let lh = 2, rh = 2;
  if (frame === 'run1') { lh = 2; rh = 1; } else if (frame === 'run2') { lh = 1; rh = 2; }
  R(c, 4, 17, 2, lh, skin); R(c, 8, 17, 2, rh, skin);
  R(c, 4, 17 + lh, 2, 1, '#ffffff'); R(c, 8, 17 + rh, 2, 1, '#ffffff');
  // cabeza
  R(c, 4, 1, 6, 6, skin);
  R(c, 4, 6, 6, 1, skinD);
  switch (pl.style) {
    case 'afro': R(c, 3, 0, 8, 3, hair); R(c, 3, 3, 1, 2, hair); R(c, 10, 3, 1, 2, hair); break;
    case 'braids': R(c, 4, 1, 6, 2, hair); R(c, 3, 3, 1, 4, hair); R(c, 10, 3, 1, 4, hair); break;
    case 'bun': R(c, 4, 1, 6, 2, hair); R(c, 6, 0, 2, 1, hair); break;
    case 'bald': R(c, 5, 1, 4, 1, shade(skin, 25)); break;
    default: R(c, 4, 1, 6, 2, hair);
  }
  if (pl.band) R(c, 4, 3, 6, 1, pl.band);
  P(c, 5, 4, '#1a1a1a'); P(c, 8, 4, '#1a1a1a');
  if (pl.beard) R(c, 5, 6, 4, 1, hair);
}
