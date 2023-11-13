import GameOver from './scenes/GameOver.js';
import Level1 from './scenes/Level1.js';
import Preload from './scenes/Preload.js';
import Winner from './scenes/Winner.js';

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 640,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
    //   gravity: { y: 200 },
      debug: false,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Preload, Level1, Winner, GameOver],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);