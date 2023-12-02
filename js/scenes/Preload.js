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
    this.load.image("ship1", "../../images/nave.PNG");
    this.load.image("ship2", "../../images/nave2.png");
    this.load.image("ship3", "../../images/nave3.png");
    this.load.image("ship4", "../../images/nave4.png");
    this.load.image("ship5", "../../images/nave5-removebg-preview.png");
    this.load.image("fondo", "../../images/fondo2.jpg");
    this.load.spritesheet("rocks", "../../images/rocks.png", {
      frameWidth: 125,
      frameHeight: 100,
    });
    this.load.spritesheet("exp", "../../images/exp.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("effect", "../../images/sprite.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.image("bullet", "../../images/bullet.png");
    this.load.image("eship", "../../images/eship.png");
    this.load.image("ebullet", "../../images/ebullet.png");
    this.load.image("game-over", "../../images/game-over.png");
    this.load.image("btn_start", "../../images/btn_Start2.png");
    this.load.image("btn_sound", "../../images/btn_sound2.png");
    this.load.image("btn_notSound", "../../images/btn_notSound2.png");
    this.load.image("btn_pause", "../../images/btn_pause2.png");
    this.load.image("btn_play", "../../images/btn_play2.png");
    this.load.image("btn_help", "../../images/btn_help2.png");

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
