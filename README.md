# NBA Pixel Hoops

Videojuego de básquetbol 2D 5 vs 5 inspirado en la NBA, con cámara top-down y estética pixel art retro.
Hecho con **HTML5 + CSS3 + JavaScript (módulos ES) + Phaser 3**. Todos los sprites, la cancha y los sonidos
se generan por código: no hay imágenes ni audios externos que puedan faltar.

🔗 **Jugar online:** https://nba-pixel-hoops.onrender.com

## Cómo ejecutarlo en Visual Studio Code (Live Server)

1. Instala **Visual Studio Code** y la extensión **Live Server** (autor: Ritwick Dey).
2. `Archivo > Abrir carpeta…` y elige la carpeta `nba-pixel-game` (la que contiene `index.html`).
3. Clic derecho sobre `index.html` > **Open with Live Server** (o botón *Go Live* abajo a la derecha).
4. Se abre `http://127.0.0.1:5500` y el juego arranca en el menú principal.

> Necesitas abrirlo con Live Server (servidor HTTP): los módulos ES no funcionan con doble clic en `index.html`.
> Phaser se descarga de un CDN. Sin internet: guarda `phaser.min.js` en `vendor/` (ver `vendor/README.md`).

## Controles

| Tecla | Acción |
|---|---| 
| W A S D | Mover |
| Shift | Correr |
| Espacio | Lanzar (bandeja si estás cerca del aro; tiro libre con barra de tiempo) |
| E | Pasar |
| Q | Cambiar de jugador |
| R | Intentar robar el balón |
| F | Bloquear / saltar a defender |
| P o Esc | Pausa (muestra la ayuda de controles) |
| H | Mostrar/ocultar la ayuda inferior |

### Modo 1 vs 1 Amigo (mismo teclado)

| | Jugador 1 | Jugador 2 |
|---|---|---|
| Mover | W A S D | Flechas |
| Correr | Shift | `,` |
| Lanzar | Espacio | Enter |
| Robar | R | `.` |
| Bloquear | F | `-` |

## Reglas implementadas

4 cuartos con cronómetro, reloj de 24 s, tiros de 2 y 3 puntos, tiros libres, faltas (bonus desde la 5.ª falta),
saques de banda/fondo, balón fuera, cambio de cancha en la 2.ª mitad, tiempo extra si hay empate y pantalla de
victoria/derrota con estadísticas. Los cuartos duran 1–3 minutos reales según el modo (configurable).

**30 equipos** de la NBA (Este y Oeste).

Modos: Exhibición, Arcade, Pro, Espectador CPU (CPU vs CPU), **1 vs 1 Amigo** y 1 vs 1 CPU. Dificultad de la CPU: Fácil / Normal / Difícil.

## Estructura del proyecto

```
nba-pixel-game/
├── index.html              # Página única: carga Phaser y game.js
├── style.css               # Estilos de la página y escalado nítido del canvas
├── game.js                 # Punto de entrada: configuración de Phaser y escenas
├── package.json            # Metadatos (type: module) y script opcional de arranque
├── README.md
├── tools/build-pixel-font.py # genera la fuente pixel
├── .vscode/settings.json   # Ajustes de Live Server
├── vendor/                 # (opcional) copia local de phaser.min.js
├── assets/                 # Recursos propios opcionales (el juego no los necesita)
│   ├── fonts/              #   pixel-nba.ttf (fuente pixel propia)
│   ├── players/
│   ├── courts/
│   ├── ball/
│   └── audio/
└── src/
    ├── config/             # Constantes y datos de configuración
    │   ├── constants.js    #   dimensiones, cancha, aros, colores, modos
    │   └── controls.js     #   lista de controles para la ayuda
    ├── scenes/             # Escenas de Phaser (una por pantalla)
    │   ├── BootScene.js · MenuScene.js · TeamSelectScene.js
    │   ├── SettingsScene.js · InstructionsScene.js
    │   └── GameScene.js · ResultScene.js
    ├── players/            # Entidad jugador
    │   ├── Player.js       #   movimiento, tiro, bloqueo, animación
    │   └── PlayerSprites.js#   sprites pixel art generados (dorsal, peinado, colores)
    ├── teams/              # 30 equipos NBA, colores y quintetos con ratings
    │   ├── builders.js · teamsData.js
    │   └── easternConference.js · westernConference.js
    ├── systems/            # Lógica reutilizable del juego
    │   ├── Ball.js         #   física y estados del balón
    │   ├── AIController.js #   IA de compañeros y rivales
    │   ├── InputController.js # teclado
    │   ├── MatchRules.js   #   cuartos, relojes, puntos, faltas, tiros libres, saques
    │   ├── CourtRenderer.js#   dibujo de la cancha y las gradas
    │   ├── TextureFactory.js # balón, sombra y aro
    │   ├── AudioSystem.js  #   efectos de sonido sintetizados (WebAudio)
    │   └── SettingsStore.js#   configuración persistente (localStorage)
    ├── ui/                 # Componentes de interfaz
    │   ├── Button.js       #   botón y lista de botones navegable
    │   ├── Scoreboard.js   #   marcador digital, avisos y barra de tiro libre
    │   ├── ControlsPanel.js
    │   ├── Backdrop.js     #   fondo y títulos de los menús
    │   └── PixelText.js    #   texto pixel nítido
    └── utils/              # Funciones puras
        ├── math.js · format.js · court.js · canvas.js · color.js
```

Regla de dependencias: `config` y `utils` no dependen de nada; `teams`, `systems` y `players` usan
`config`/`utils`; `ui` usa `systems`; `scenes` coordina todo.

## Personalizar

- **Equipos y jugadores**: edita `src/teams/easternConference.js` y `westernConference.js` (nombre, dorsal, piel, peinado y ratings).
  Las plantillas son aproximadas; cámbialas libremente.
- **Duración y ritmo**: `MODES` en `src/config/constants.js`.
- **Sprites propios**: sustituye las funciones de `PlayerSprites.js` por `this.load.image(...)` con archivos en `assets/`.
