export default class Preload extends Phaser.Scene {
  // escena para optimiozar tiempos
  // carga el preload solo una vez y sirve para todo el juego
  constructor() {
    // key of the scene
    super("preload");
  }

  preload() {
    // load assets
    this.load.image("ship", "../../images/player.png");
    this.load.image("fondoGalaxia", "../../images/background.jpg");
    this.load.spritesheet("rocks", "../../images/rocks.png", {
      frameWidth: 125,
      frameHeight: 100,
    });
    this.load.spritesheet("exp", "../../images/exp.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("bullet", "../../images/bullet.png");
    this.load.image("eship", "../../images/eship.png");
    this.load.image("ebullet", "../../images/ebullet.png");
    this.load.image("game-over", "../../images/game-over.png");
  }

  create() {
    // init scene juego
    this.scene.start("Level1");
  }
}
