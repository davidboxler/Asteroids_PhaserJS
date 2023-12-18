export default class Preload extends Phaser.Scene {
  // Escena para optimiozar tiempos
  // Carga el preload solo una vez y sirve para todo el juego
  constructor() {
    // Constructor de la scena
    super("preload");
  }

  preload() {
    /* ---------- IMAGENES NAVES ----------- */
    this.load.image("ship1", "./assets/images/nave.PNG");

    /* ---------- IMAGENES FONDO ----------- */
    this.load.image("fondo", "./assets/images/fondo2.jpg");

    /* ---------- IMAGENES DISPAROS ----------- */
    this.load.image("bullet", "./assets/images/bullet.png");

    /* ---------- IMAGENES BOTONES VIDEOJUEGO ----------- */
    this.load.image("btn_start", "./assets/images/btn_Start2.png");
    this.load.image("btn_next", "./assets/images/btn_next.png");
    this.load.image("btn_sound", "./assets/images/btn_sound2.png");
    this.load.image("btn_notSound", "./assets/images/btn_notSound2.png");
    this.load.image("btn_pause", "./assets/images/btn_pause2.png");
    this.load.image("btn_play", "./assets/images/btn_play2.png");
    this.load.image("btn_help", "./assets/images/btn_help2.png");
    this.load.image("btn_salir", "./assets/images/btn_Salir.png");

    /* ---------- IMAGENES INSTRUCCIONES ----------- */
    this.load.image("box_shoter", "./assets/images/disparo_ast.png");
    this.load.image("box_shoter_exp", "./assets/images/disparo_exp.png");
    this.load.image('box_move', './assets/images/movimiento.png');

    /* ---------- AUDIOS VIDEOJUEGO ----------- */
    this.load.audio("laserPlayer", "./assets/audio/laser.ogg");
    this.load.audio("laserEnemy", "./assets/audio/enemyShoot.wav");
    this.load.audio("explosion", "./assets/audio/explode.wav");
    this.load.audio("soundTrack", "./assets/audio/background.ogg");

    /* ---------- SPRITESHEET VIDEOJUEGO ----------- */
    this.load.spritesheet("rocks", "./assets/images/rocks.png", {
      frameWidth: 125,
      frameHeight: 100,
    });
    this.load.spritesheet("exp", "./assets/images/exp.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("effect", "./assets/images/sprite.png", {
      frameWidth: 100,
      frameHeight: 100,
    });

    /* ---------- IMAGENES FINALES VIDEOJUEGO ----------- */
    this.load.image("game-over", "./assets/images/game-over.png");
    this.load.image("win", "./assets/images/winner.png");
    this.load.image("title", "./assets/images/titulo.png")

    /* --------------- CINEMATICAS ------------------- */
    this.load.video("cinematicaInicial", "./assets/images/cinematica.mp4")
    this.load.video("creditos", "./assets/images/creditos.mp4")
  }

  create() {
    // SCENA DE INICIO VIDEOJUEGO
    this.scene.start("Menu");
  }
}
