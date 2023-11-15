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
    this.load.image("fondo", "../../images/fondo2.jpg");
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

    this.load.audio("laserPlayer", "../../audio/laser.ogg");
    this.load.audio("laserEnemy", "../../audio/enemyShoot.wav");
    this.load.audio("explosion", "../../audio/explode.wav");
    this.load.audio("soundTrack", "../../audio/background.ogg");
  }

  create() {
    // init scene juego
    this.scene.start("Level1");
  }
}
