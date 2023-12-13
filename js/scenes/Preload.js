export default class Preload extends Phaser.Scene {
  // Escena para optimiozar tiempos
  // Carga el preload solo una vez y sirve para todo el juego
  constructor() {
    // Constructor de la scena
    super("preload");
  }

  preload() {
    /* ---------- IMAGENES NAVES ----------- */
    this.load.image("ship1", "../../images/nave.PNG");
    this.load.image("ship2", "../../images/nave2.png");
    this.load.image("ship3", "../../images/nave3.png");

    /* ---------- IMAGENES FONDO ----------- */
    this.load.image("fondo", "../../images/fondo2.jpg");

    /* ---------- IMAGENES DISPAROS ----------- */
    this.load.image("bullet", "../../images/bullet.png");
    this.load.image("ebullet", "../../images/ebullet.png");

    /* ---------- IMAGENES BOTONES VIDEOJUEGO ----------- */
    this.load.image("btn_start", "../../images/btn_Start2.png");
    this.load.image("btn_next", "../../images/btn_next.png");
    this.load.image("btn_sound", "../../images/btn_sound2.png");
    this.load.image("btn_notSound", "../../images/btn_notSound2.png");
    this.load.image("btn_pause", "../../images/btn_pause2.png");
    this.load.image("btn_play", "../../images/btn_play2.png");
    this.load.image("btn_help", "../../images/btn_help2.png");

    /* ---------- IMAGENES INSTRUCCIONES ----------- */
    this.load.image("box_shoter", "../../images/disparo_ast.png");
    this.load.image("box_shoter_exp", "../../images/disparo_exp.png");
    this.load.image('box_move', '../../images/movimiento.png');

    /* ---------- AUDIOS VIDEOJUEGO ----------- */
    this.load.audio("laserPlayer", "../../audio/laser.ogg");
    this.load.audio("laserEnemy", "../../audio/enemyShoot.wav");
    this.load.audio("explosion", "../../audio/explode.wav");
    this.load.audio("soundTrack", "../../audio/background.ogg");

    /* ---------- SPRITESHEET VIDEOJUEGO ----------- */
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

    /* ---------- IMAGENES FINALES VIDEOJUEGO ----------- */
    this.load.image("game-over", "../../images/game-over.png");
    this.load.image("win", "../../images/winner.png");
    this.load.image("title", "../../images/titulo.png")
  }

  create() {
    // SCENA DE INICIO VIDEOJUEGO
    this.scene.start("Menu");
  }
}
