import { THREE_R, CORNER_DY } from '../config/constants.js';

/** ¿Un tiro desde (x, y) hacia el aro `h` es de tres puntos? */
export function isThree(x, y, h) {
  const dx = Math.abs(x - h.x);
  const dy = Math.abs(y - h.y);
  if (dx <= Math.sqrt(THREE_R * THREE_R - CORNER_DY * CORNER_DY)) return dy >= CORNER_DY;
  return Math.hypot(dx, dy) >= THREE_R;
}
