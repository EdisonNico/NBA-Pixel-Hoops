import { COURT, FONT, GAME_H, GAME_W, HOOPS } from '../config/constants.js';
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
    this.spectator = !!S.mode().spectator; // modo CPU vs CPU: nadie controla jugadores
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
      for (let i = 0; i < 5; i++) {
        const p = new Player(this, this.teams[s], s, i, s === 0 ? 'main' : 'alt');
        p.place(C.cx + (s === 0 ? -40 : 40), C.cy + (i - 2) * 42);
        this.players.push(p);
      }
    });
    this.ball = new Ball(this);
    this.hud = new Scoreboard(this, this.teams);
    this.ai = new AIController(this);
    this.ctrl = new InputController(this);
    this.match = new MatchRules(this);
    this.marker = this.add.image(0, 0, 'marker').setDepth(950);
    // ayuda inferior
    this.helpTxt = this.add.text(GAME_W / 2, 351, 'WASD mover | SHIFT correr | ESPACIO tirar | E pasar | Q cambiar | R robar | F bloquear | P pausa | H ayuda',
      { fontFamily: FONT, fontSize: '8px', color: '#ffffff', backgroundColor: '#000000aa' }).setOrigin(0.5).setDepth(1000);
    this.helpTxt.setVisible(!!S.get('hints'));
    this.buildPauseUI();
    this.match.start();
    this.hud.set(this.match);
  }
  // ---- selección del jugador controlado ----
  setControlled(p) { if (this.spectator) return; this.controlled = p; this.hud.setPlayer(p); }
  autoSelect(p) {
    if (this.spectator) return;
    if (p && p.side === 0 && !p.freeze) return this.setControlled(p);
    const b = this.ball, mates = this.players.filter(q => q.side === 0 && !q.freeze);
    if (!mates.length) return;
    mates.sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y));
    this.setControlled(mates[0]);
  }
  cycleControlled() {
    if (this.spectator) return;
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
  aiDefMul(p) { return p.side === 1 ? [0.7, 1, 1.3][Settings.get('diff')] : 1; }
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
    this.ctrlTexts = drawControls(this, 150, 80, 16, D + 1).map(t => t.setVisible(false));
    const mk = (y, label, cb) => {
      const b = new Button(this, GAME_W / 2, y, 200, 22, label, () => { if (this.paused) cb(); });
      b.bg.setDepth(D + 1); b.text.setDepth(D + 2); b.bg.setVisible(false); b.text.setVisible(false); ui.push(b.bg, b.text);
      return b;
    };
    mk(262, 'CONTINUAR (P)', () => this.setPaused(false));
    mk(290, 'SALIR AL MENU', () => this.scene.start('Menu'));
    this.pauseKb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
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
    if (this.paused) { if (Phaser.Input.Keyboard.JustDown(this.pauseKb)) this.setPaused(false); return; }
    this.ai.update(dt);
    this.ctrl.act();
    this.players.forEach(p => p.update(dt));
    this.separate();
    this.ball.update(dt);
    this.match.update(dt);
    const c = this.controlled;
    if (c) this.marker.setPosition(Math.round(c.x), Math.round(c.y - 26 - c.jz + Math.sin(time / 120) * 1.5)).setVisible(true);
    else this.marker.setVisible(false);
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
    this.scene.start('Result', { score: m.score.slice(), teams: this.teams, stats: m.stats, scorers, ot: m.ot });
  }
}
