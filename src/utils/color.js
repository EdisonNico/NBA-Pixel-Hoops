/** Utilidades de color: luminancia y elección de un color de texto legible. */
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
};

/** Devuelve `fg` si contrasta lo suficiente con `bg`; si no, blanco (o negro sobre fondos muy claros). */
export function readableOn(bg, fg) {
  const a = lum(bg), b = lum(fg);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  if (ratio >= 3) return fg;
  return a > 0.5 ? '#111111' : '#ffffff';
}
