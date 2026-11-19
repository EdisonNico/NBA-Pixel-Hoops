import { COURT, FONT, GAME_H, GAME_W, HOOPS } from '../config/constants.js';
import { CONTROLS_P1, CONTROLS_P2 } from '../config/controls.js';
import { Player } from '../players/Player.js';
import { AIController } from '../systems/AIController.js';
import { Sfx } from '../systems/AudioSystem.js';
import { Ball } from '../systems/Ball.js';
import { ensureCourt } from '../systems/CourtRenderer.js';
import { InputController } from '../systems/InputController.js';
import { MatchRules } from '../systems/MatchRules.js';
import { Settings } from '../systems/SettingsStore.js';
import { ensureRim, ensureShadow } from '../systems/TextureFactory.js';
import { TEAMS, teamById } from '../teams/teamsData.js';
import { Button } from '../ui/Button.js';
import { drawControls } from '../ui/ControlsPanel.js';
import { Scoreboard } from '../ui/Scoreboard.js';
import { shade } from '../utils/math.js';

const C = COURT;
export class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }
  create() {
    const S = Settings;
    this.speedMul = S.mode().speed;
    const mode = S.mode();
    this.spectator = !!mode.spectator; // modo CPU vs CPU: nadie controla jugadores
    this.versus = !!mode.versus;       // modo 1 vs 1: dos personas en el mismo teclado
    this.perTeam = mode.perTeam || 5;
    this.controlledBy = [null, null];  // jugador controlado por una persona en cada lado
    let ta = teamById(S.get('team')), tb = teamById(S.get('rival'));
    if (ta.id === tb.id) tb = TEAMS.find(t => t.id !== ta.id);
    this.teams = [ta, tb];
    this.paused = false; this.controlled = null;
    ensureShadow(this); ensureRim(this);
    this.add.image(0, 0, ensureCourt(this, ta)).setOrigin(0).setDepth(0);
    this.rims = [HOOPS.left, HOOPS.right].map(h => this.add.image(h.x, h.y - 6, 'rim').setDepth(800));
    // jugadores
    this.players = [];
    [0, 1].forEach(s => {
      // 5v5: todo el quinteto; 1v1: solo la estrella del equipo (mejor valoración)
      const roster = this.perTeam === 5 ? [0, 1, 2, 3, 4] : [this.starIndex(this.teams[s])];
      roster.forEach((ri, k) => {
        const p = new Player(this, this.teams[s], s, ri, s === 0 ? 'main' : 'alt');
        p.slot = k;
        if (this.perTeam === 5) p.place(C.cx + (s === 0 ? -40 : 40), C.cy + (k - 2) * 42);
        else p.place(C.cx + (s === 0 ? -50 : 50), C.cy);
        this.players.push(p);
      });
    });
    if (this.perTeam === 1 && !this.spectator) {
      this.controlledBy[0] = this.players.find(p => p.side === 0);
      if (this.versus) this.controlledBy[1] = this.players.find(p => p.side === 1);
      this.controlled = this.controlledBy[0];
    }
    this.ball = new Ball(this);
    this.hud = new Scoreboard(this, this.teams);
    this.ai = new AIController(this);
    this.ctrl = new InputController(this);
    this.match = new MatchRules(this);
    this.markers = [this.add.image(0, 0, 'marker').setDepth(950), this.add.image(0, 0, 'marker').setDepth(950).setTintFill(0x66ddff)];
    if (this.controlled) this.hud.setPlayer(this.controlled);
    // ayuda inferior
    const help = this.versus
      ? 'J1: WASD mover, SHIFT correr, ESPACIO tirar, R robar, F bloquear | J2: FLECHAS, "," correr, ENTER tirar, "." robar, "-" bloquear'
      : 'WASD mover | SHIFT correr | ESPACIO tirar | E pasar | Q cambiar | R robar | F bloquear | P pausa | H ayuda';
    this.helpTxt = this.add.text(GAME_W / 2, 351, help,
      { fontFamily: FONT, fontSize: '8px', color: '#ffffff', backgroundColor: '#000000aa' }).setOrigin(0.5).setDepth(1000);
    this.helpTxt.setVisible(!!S.get('hints'));
    this.buildPauseUI();
    this.match.start();
    this.hud.set(this.match);
    if (this.perTeam === 1) {
      const n = side => this.players.find(p => p.side === side).data.name.toUpperCase();
      this.hud.banner(n(0) + ' VS ' + n(1), '#ffd23f', 1800);
    }
  }
  /** Índice del jugador con mejor valoración media (la estrella del equipo). */
  starIndex(team) {
    const ovr = p => p.spd + p.sho + p.thr + p.pas + p.def;
    return team.players.reduce((best, p, i) => (ovr(p) > ovr(team.players[best]) ? i : best), 0);
  }
  isHuman(p) { return this.controlledBy[p.side] === p; }
  // ---- selección del jugador controlado ----
  setControlled(p) { if (this.spectator || this.versus) return; this.controlled = p; this.controlledBy[0] = p; this.hud.setPlayer(p); }
  autoSelect(p) {
    if (this.spectator || this.versus) return;
    if (p && p.side === 0 && !p.freeze) return this.setControlled(p);
    const b = this.ball, mates = this.players.filter(q => q.side === 0 && !q.freeze);
    if (!mates.length) return;
    mates.sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y));
    this.setControlled(mates[0]);
  }
  cycleControlled() {
    if (this.spectator || this.versus) return;
    const m = this.match, mates = this.players.filter(q => q.side === 0 && !q.freeze);
    if (mates.length < 2) return;
    if (m.poss === 0 && this.ball.mode === 'held') {
      const i = mates.indexOf(this.controlled);
      this.setControlled(mates[(i + 1) % mates.length]);
    } else {
      const b = this.ball;
      mates.sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y));
      const i = mates.indexOf(this.controlled);
      this.setControlled(mates[(i + 1) % Math.min(3, mates.length)] === this.controlled ? mates[0] : mates[(i + 1) % Math.min(3, mates.length)]);
    }
  }
  aiDefMul(p) { return p.side === 1 && !this.versus ? [0.7, 1, 1.3][Settings.get('diff')] : 1; }
  teamColor(side) { return shade(this.teams[side].main, 60); }
  cheer() { this.cameras.main.shake(120, 0.003); }
  rimShake(h) {
    const r = this.rims[h.dir < 0 ? 0 : 1];
    this.tweens.killTweensOf(r); r.setScale(1);
    this.tweens.add({ targets: r, scaleY: 1.4, scaleX: 1.1, duration: 70, yoyo: true, repeat: 1 });
  }
  // ---- pausa ----
  buildPauseUI() {
    const D = 2000, ui = this.pauseUI = [];
    const add = o => { o.setDepth(D).setVisible(false); ui.push(o); return o; };
    add(this.add.rectangle(0, 0, GAME_W, GAME_H, 0x000000, 0.8).setOrigin(0));
    add(this.add.text(GAME_W / 2, 40, 'PAUSA', { fontFamily: FONT, fontSize: '24px', fontStyle: 'bold', color: '#ffd23f' }).setOrigin(0.5));
    if (this.versus) {
      const h = { fontFamily: FONT, fontSize: '11px', fontStyle: 'bold', color: '#66ddff' };
      this.ctrlTexts = [
        add(this.add.text(40, 70, 'JUGADOR 1', h)), add(this.add.text(350, 70, 'JUGADOR 2', h)),
        ...drawControls(this, 40, 92, 16, D + 1, CONTROLS_P1),
        ...drawControls(this, 350, 92, 16, D + 1, CONTROLS_P2)
      ];
      this.ctrlTexts.forEach(t => t.setVisible(false));
    } else this.ctrlTexts = drawControls(this, 150, 80, 16, D + 1).map(t => t.setVisible(false));
    const mk = (y, label, cb) => {
      const b = new Button(this, GAME_W / 2, y, 200, 22, label, () => { if (this.paused) cb(); });
      b.bg.setDepth(D + 1); b.text.setDepth(D + 2); b.bg.setVisible(false); b.text.setVisible(false); ui.push(b.bg, b.text);
      return b;
    };
    mk(262, 'CONTINUAR (P)', () => this.setPaused(false));
    mk(290, 'SALIR AL MENU', () => this.scene.start('Menu'));
  }
  setPaused(v) {
    this.paused = v;
    this.pauseUI.forEach(o => o.setVisible(v));
    this.ctrlTexts.forEach(o => o.setVisible(v));
    if (v) Sfx.click();
  }
  // ---- bucle ----
  update(time, delta) {
    const dt = Math.min(delta / 1000, 0.05);
    this.ctrl.poll();
    if (this.ctrl.pressed('pause') || this.ctrl.pressed('esc')) { if (this.match.phase !== 'over') this.setPaused(!this.paused); }
    if (this.ctrl.pressed('help')) { this.helpTxt.setVisible(!this.helpTxt.visible); }
    if (this.paused) { if (this.ctrl.pressed('enter')) this.setPaused(false); return; }
    this.ai.update(dt);
    this.ctrl.act();
    this.players.forEach(p => p.update(dt));
    this.separate();
    this.ball.update(dt);
    this.match.update(dt);
    this.markers.forEach((mk, s) => {
      const c = this.controlledBy[s];
      if (c) mk.setPosition(Math.round(c.x), Math.round(c.y - 26 - c.jz + Math.sin(time / 120) * 1.5)).setVisible(true);
      else mk.setVisible(false);
    });
  }
  separate() {
    const ps = this.players;
    for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
      const a = ps[i], b = ps[j];
      if (a.freeze || b.freeze) continue;
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      if (d < 8 && d > 0.01) {
        const k = (8 - d) / 2 / d;
        a.x -= dx * k; a.y -= dy * k; b.x += dx * k; b.y += dy * k;
      }
    }
  }
  endGame() {
    const m = this.match;
    const scorers = this.players.map(p => ({ name: p.data.name, num: p.data.num, pts: p.pts || 0, side: p.side }));
    this.scene.start('Result', { score: m.score.slice(), teams: this.teams, stats: m.stats, scorers, ot: m.ot, versus: this.versus });
  }
}
