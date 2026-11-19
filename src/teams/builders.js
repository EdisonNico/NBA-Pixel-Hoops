// Ayudantes para definir equipos y jugadores. Ratings: [velocidad, tiro, triple, pase, defensa] (0-99).

export const SK = { a: '#f1c27d', b: '#c68642', c: '#8d5524', d: '#5c3a1e' }; // tonos de piel
export const HR = { blk: '#15110f', brn: '#3b2314', gry: '#8a8a8a', blo: '#caa24a' }; // colores de pelo

/** Pl(nombre, dorsal, posición, piel, pelo, estilo, ratings, extras) */
export const Pl = (name, num, pos, skin, hair, style, r, ex) => Object.assign({
  name, num, pos, skin: SK[skin], hair: HR[hair], style,
  spd: r[0], sho: r[1], thr: r[2], pas: r[3], def: r[4]
}, ex || {});

/** T(id, ciudad, nombre, siglas, color principal, color secundario, jugadores) */
export const T = (id, city, name, abbr, main, trim, players) => ({
  id, city, name, abbr, main, trim, altMain: '#f2f2f2', altTrim: main, players
});
