// Catálogo de los 30 equipos de la NBA (quinteto titular de cada uno).

import { EAST } from './easternConference.js';
import { WEST } from './westernConference.js';

export const TEAMS = [...EAST, ...WEST];
export const teamById = id => TEAMS.find(t => t.id === id) || TEAMS[0];
