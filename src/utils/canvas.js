/** Primitivas de dibujo pixel a pixel sobre Canvas 2D y creación de texturas. */

/** Rectángulo relleno. */
export const R = (c, x, y, w, h, col) => {
  c.fillStyle = col;
  c.fillRect(x, y, w, h);
};

/** Un solo píxel. */
export const P = (c, x, y, col) => {
  c.fillStyle = col;
  c.fillRect(Math.round(x), Math.round(y), 1, 1);
};

/** Arco dibujado píxel a píxel. */
export function arcPx(c, cx, cy, r, a0, a1, col) {
  c.fillStyle = col;
  const step = 1 / Math.max(r, 1);
  for (let a = a0; a <= a1; a += step) c.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 1, 1);
}

/** Generador pseudoaleatorio determinista (LCG). */
export function createRng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/** Crea (una sola vez) una textura de canvas y la dibuja con `fn(ctx)`. */
export function canvasTex(scene, key, w, h, fn) {
  if (scene.textures.exists(key)) return key;
  const t = scene.textures.createCanvas(key, w, h);
  fn(t.getContext());
  t.refresh();
  return key;
}
