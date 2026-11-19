// Configuración persistente (localStorage con respaldo en memoria).

import { MODES } from '../config/constants.js';

const KEY = 'nba-pixel-hoops-v1';
const defaults = { team: 'lal', rival: 'bos', mode: 0, diff: 1, sound: true, volume: 0.5, hints: true, quarter: 0 };
let data = Object.assign({}, defaults);
try { Object.assign(data, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* sin storage */ }
export const Settings = {
  get: k => data[k],
  set(k, v) {
    data[k] = v;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignorar */ }
  },
  // duración de cuarto en segundos reales: 0 = según modo
  quarterSeconds() {
    const q = data.quarter;
    return q ? q : MODES[data.mode].quarter;
  },
  mode: () => MODES[data.mode]
};
