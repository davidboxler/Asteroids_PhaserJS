import GameOver from './scenes/GameOver.js';
import Level1 from './scenes/Level1.js';
import Menu from './scenes/Menu.js';
import Preload from './scenes/Preload.js';
import Winner from './scenes/Winner.js';

// Crea un nuevo objeto de configuración de Phaser
const config = {
  type: Phaser.AUTO,
  width: 640,  // Ancho fijo para el diseño vertical
  height: 960, // Alto fijo para el diseño vertical
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 200 },
      debug: false,
    },
  },
  // Lista de escenas para cargar
  // Solo la primera escena se mostrará
  // Recuerda importar la escena antes de agregarla a la lista
  scene: [Preload, Level1, Winner, GameOver, Menu],
};

// Crea una nueva instancia de juego de Phaser
window.game = new Phaser.Game(config);