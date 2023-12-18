import Cinematica from '../assets/scenes/Cinematica.js';
import Creditos from '../assets/scenes/Creditos.js';
import GameOver from '../assets/scenes/GameOver.js';
import Help from '../assets/scenes/Help.js';
import Level1 from '../assets/scenes/Level1.js';
import Level2 from '../assets/scenes/Level2.js';
import Level3 from '../assets/scenes/Level3.js';
import Menu from "../assets/scenes/Menu.js";
import Preload from '../assets/scenes/Preload.js';
import Winner from '../assets/scenes/Winner.js';

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
  scene: [Preload, Level1, Level2, Level3, Winner, GameOver, Menu, Help, Creditos, Cinematica],
};

// Crea una nueva instancia de juego de Phaser
window.game = new Phaser.Game(config);