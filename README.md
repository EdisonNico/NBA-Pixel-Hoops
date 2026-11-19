# 🏀 NBA Pixel Hoops

Videojuego de básquetbol 2D 5 vs 5 inspirado en la NBA, con cámara top-down y estética pixel art retro.
Hecho con **HTML5 + CSS3 + JavaScript (módulos ES) + Phaser 3**.

Todos los sprites, la cancha y los sonidos se generan por código, así que no hay imágenes ni audios
externos que puedan faltar.

---

## 🎮 De qué trata el juego

Eliges tu equipo NBA y un rival, y juegas un partido completo de 4 cuartos contra la CPU. Controlas a un
jugador a la vez (puedes cambiar entre los cinco), y la IA maneja a tus compañeros y a los rivales.
Gana el equipo con más puntos al final; si hay empate, se juega tiempo extra.

**Equipos (8):** Lakers, Warriors, Celtics, Bulls, Heat, Knicks, Bucks y Mavericks, cada uno con sus colores,
uniformes y un quinteto de jugadores reconocibles (LeBron James, Stephen Curry, Luka Dončić, Jayson Tatum,
Giannis Antetokounmpo, Jalen Brunson y más). Cada jugador tiene dorsal, peinado, tono de piel y ratings propios
(velocidad, tiro, pase, defensa, etc.).

> Las plantillas son aproximadas y se pueden editar en `src/teams/teamsData.js`.

---

## 🕹️ Controles

| Tecla | Acción |
|---|---|
| W A S D | Mover |
| Shift | Correr |
| Espacio | Lanzar (bandeja si estás cerca del aro; en tiros libres usa la barra de tiempo) |
| E | Pasar |
| Q | Cambiar de jugador |
| R | Intentar robar el balón |
| F | Bloquear / saltar a defender |
| P o Esc | Pausa (muestra la ayuda de controles) |
| H | Mostrar u ocultar la ayuda inferior |

---

## 📋 Reglas implementadas

- 4 cuartos con cronómetro y reloj de 24 segundos.
- Tiros de 2 y 3 puntos, bandejas y tiros libres.
- Faltas (bonus desde la 5.ª falta), robos y bloqueos.
- Posesión del balón, saques de banda y de fondo, balón fuera.
- Cambio de cancha en la segunda mitad.
- Tiempo extra si hay empate.
- Pantalla de victoria o derrota con estadísticas finales.

---

## 🧭 Menú principal

- **Jugar partido**
- **Seleccionar equipo**
- **Seleccionar rival**
- **Modo de juego:** Exhibición, Arcade, Pro y Espectador CPU (CPU vs CPU)
- **Configuración:** duración del cuarto, dificultad (Fácil / Normal / Difícil), sonido, volumen,
  ayuda en partido y pantalla completa
- **Instrucciones**

---

## ▶️ Cómo ejecutarlo en Visual Studio Code (Live Server)

1. Instala **Visual Studio Code** y la extensión **Live Server** (autor: Ritwick Dey).
2. `Archivo > Abrir carpeta…` y elige la carpeta `nba-pixel-game` (la que contiene `index.html`).
3. Clic derecho sobre `index.html` > **Open with Live Server** (o el botón **Go Live** abajo a la derecha).
4. Se abre `http://127.0.0.1:5500` y el juego arranca en el menú principal.

> Hay que abrirlo con Live Server: los módulos ES no funcionan con doble clic sobre `index.html`.
> Phaser se carga desde un CDN. Sin internet, guarda `phaser.min.js` en `vendor/` (ver `vendor/README.md`).

---

## 🌐 Cómo publicarlo

Es un sitio estático, así que se puede subir gratis:

- **Render:** New → Static Site → conecta el repositorio de GitHub. Build Command vacío y Publish Directory `.`
- **Netlify Drop:** arrastra la carpeta en app.netlify.com/drop.
- **GitHub Pages:** Settings → Pages → Deploy from branch (main).
- **itch.io:** sube un `.zip` con `index.html` en la raíz (proyecto tipo HTML).

---

## 🗂️ Estructura del proyecto

```
nba-pixel-game/
├── index.html              # Página única: carga Phaser y game.js
├── style.css               # Estilos y escalado nítido del canvas
├── game.js                 # Punto de entrada: configuración de Phaser y escenas
├── package.json            # Metadatos (type: module)
├── README.md
├── .vscode/settings.json   # Ajustes de Live Server
├── vendor/                 # (opcional) copia local de phaser.min.js
├── assets/                 # Recursos propios opcionales (el juego no los necesita)
│   ├── players/
│   ├── courts/
│   ├── ball/
│   └── audio/
└── src/
    ├── config/             # Constantes y controles
    │   ├── constants.js
    │   └── controls.js
    ├── scenes/             # Una escena por pantalla
    │   ├── BootScene.js · MenuScene.js · TeamSelectScene.js
    │   ├── SettingsScene.js · InstructionsScene.js
    │   └── GameScene.js · ResultScene.js
    ├── players/            # Entidad jugador
    │   ├── Player.js
    │   └── PlayerSprites.js
    ├── teams/
    │   └── teamsData.js    # 8 equipos NBA, colores y quintetos con ratings
    ├── systems/            # Lógica reutilizable
    │   ├── Ball.js             # física y estados del balón
    │   ├── AIController.js     # IA de compañeros y rivales
    │   ├── InputController.js  # teclado
    │   ├── MatchRules.js       # cuartos, relojes, puntos, faltas, tiros libres, saques
    │   ├── CourtRenderer.js    # cancha y gradas
    │   ├── TextureFactory.js   # balón, sombra y aro
    │   ├── AudioSystem.js      # efectos de sonido (WebAudio)
    │   └── SettingsStore.js    # configuración guardada en localStorage
    ├── ui/                 # Componentes de interfaz
    │   ├── Button.js · Scoreboard.js
    │   ├── ControlsPanel.js · Backdrop.js
    └── utils/              # Funciones puras
        ├── math.js · format.js · court.js · canvas.js
```

**Regla de dependencias:** `config` y `utils` no dependen de nada; `teams`, `systems` y `players` usan
`config` y `utils`; `ui` usa `systems`; `scenes` coordina todo.

---

## 🛠️ Qué se hizo

- Juego completo con menú, selección de equipo y rival, configuración e instrucciones.
- Partidos 5 vs 5 con IA para compañeros y rivales, con tres niveles de dificultad.
- Cancha pixel art con gradas y público, marcador digital y avisos en pantalla.
- Reorganización del código de variables globales a **módulos ES** (`import` / `export`) con carpetas por responsabilidad.
- Ajuste de la IA: menos robos y bloqueos, más ritmo y más puntos por partido.
- Pruebas por simulación: partidos completos CPU vs CPU, tiempo extra, controles aleatorios y todos los menús, sin errores.

---

## ✏️ Personalizar

- **Equipos y jugadores:** `src/teams/teamsData.js` (nombre, dorsal, piel, peinado y ratings).
- **Duración y ritmo:** `MODES` en `src/config/constants.js`.
- **Sprites propios:** reemplaza las funciones de `PlayerSprites.js` por `this.load.image(...)` con archivos en `assets/`.

---

```
┌──────────────────────────────────────┐
│        _.---._                       │
│      .'  ___  '.                     │
│     /   (o_o)   \     > Edison D.    │
│    |   /|___|\   |                   │
│    |  /_|_|_|_\  |     root@EdisonD  │
│     \    '-'    /                    │
│      '._  _  _.'                     │
│        |_||_||_|                     │
└──────────────────────────────────────┘
```
