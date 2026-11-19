/** Lista de controles mostrada en pausa e instrucciones. [tecla, descripción] */
export const CONTROLS = [
  ['W A S D', 'Mover al jugador'],
  ['SHIFT', 'Correr'],
  ['ESPACIO', 'Lanzar / bandeja (cerca del aro)'],
  ['E', 'Pasar (hacia donde apuntas)'],
  ['Q', 'Cambiar de jugador'],
  ['R', 'Intentar robar el balon'],
  ['F', 'Bloquear / saltar a defender'],
  ['P / ESC', 'Pausa'],
  ['H', 'Mostrar/ocultar ayuda']
];

/** Controles del jugador 1 en el modo 1 VS 1. */
export const CONTROLS_P1 = [
  ['W A S D', 'Mover'],
  ['SHIFT', 'Correr'],
  ['ESPACIO', 'Lanzar / bandeja'],
  ['R', 'Robar el balon'],
  ['F', 'Bloquear']
];

/** Controles del jugador 2 en el modo 1 VS 1 (mismo teclado). El jugador 1 usa solo W A S D. */
export const CONTROLS_P2 = [
  ['FLECHAS', 'Mover'],
  [',', 'Correr'],
  ['ENTER', 'Lanzar / bandeja'],
  ['.', 'Robar el balon'],
  ['-', 'Bloquear']
];
