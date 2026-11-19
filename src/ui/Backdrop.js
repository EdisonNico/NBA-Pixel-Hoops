import { GAME_W, GAME_H, FONT } from '../config/constants.js';
import { teamById } from '../teams/teamsData.js';
import { ensureCourt } from '../systems/CourtRenderer.js';

/** Fondo común de los menús: cancha del equipo + capa oscura. */
export function drawBackdrop(scene, teamId, alpha) {
  ensureCourt(scene, teamById(teamId));
  scene.add.image(0, 0, 'court_' + teamId).setOrigin(0).setDepth(0);
  scene.add.rectangle(0, 0, GAME_W, GAME_H, 0x05060f, alpha === undefined ? 0.72 : alpha).setOrigin(0).setDepth(1);
}

/** Título con sombra al estilo arcade. */
export function drawTitle(scene, text, y, size) {
  const base = { fontFamily: FONT, fontSize: (size || 24) + 'px', fontStyle: 'bold' };
  scene.add.text(GAME_W / 2 + 2, y + 2, text, { ...base, color: '#7a1020' }).setOrigin(0.5).setDepth(10);
  return scene.add.text(GAME_W / 2, y, text, { ...base, color: '#ffd23f' }).setOrigin(0.5).setDepth(11);
}
