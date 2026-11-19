/**
 * Constantes globales del juego.
 * Resolución lógica baja (640x360) para conseguir el look pixel art: Phaser la escala (FIT).
 */
export const GAME_W = 640;
export const GAME_H = 360;

/** Rectángulo de la cancha en coordenadas lógicas. */
export const COURT = { x: 40, y: 72, w: 560, h: 250 };
COURT.cx = COURT.x + COURT.w / 2;
COURT.cy = COURT.y + COURT.h / 2;

export const HOOP_OFF = 22; // distancia aro - línea de fondo
export const HOOPS = {
  left: { x: COURT.x + HOOP_OFF, y: COURT.cy, dir: -1 },
  right: { x: COURT.x + COURT.w - HOOP_OFF, y: COURT.cy, dir: 1 }
};

export const THREE_R = 118; // radio de la línea de tres puntos
export const CORNER_DY = 100; // tiros desde |dy| >= 100 cerca del fondo son triples
export const PAINT_LEN = 100;
export const PAINT_HALF = 32;
export const FT_OFF = 100; // línea de tiro libre desde la línea de fondo
export const SHOT_CLOCK = 24;

export const FONT = 'Courier New, monospace';
export const COLORS = {
  bg: '#07070d',
  gold: '#ffd23f',
  red: '#e63946',
  white: '#ffffff',
  dark: '#14142b',
  blue: '#1d3557'
};

/** Modos de juego: duración del cuarto en segundos REALES y velocidad del juego. */
export const MODES = [
  { id: 'exhibicion', name: 'EXHIBICION', quarter: 120, speed: 1.0 },
  { id: 'arcade', name: 'ARCADE', quarter: 60, speed: 1.15 },
  { id: 'pro', name: 'PRO (3 MIN)', quarter: 180, speed: 1.0 },
  { id: 'cpu', name: 'ESPECTADOR CPU', quarter: 60, speed: 1.0, spectator: true }
];

export const DIFFS = ['FACIL', 'NORMAL', 'DIFICIL'];
