export default class Help extends Phaser.Scene {
  constructor() {
    // Constructor de la scena
    super("Help");
  }

  create() {
    // Fondo
    this.background = this.add.image(0, 0, "fondo").setOrigin(0, 0);

    // Capa de color negro semitransparente
    const overlay = this.add.rectangle(
      0,
      0,
      this.game.config.width,
      this.game.config.height,
      0x000000
    );
    overlay.setOrigin(0, 0);
    overlay.setAlpha(0.5);

    // Botón siguente para comenzar el nivel 1
    let btnJugar = this.physics.add.staticGroup();
    btnJugar
      .create(330, 800, "btn_next")
      .setScale(0.55)
      .refreshBody()
      .setInteractive()
      .on("pointerdown", () => this.scene.start("Level1"));

    /* ------------------- INSTRUCCIONES ----------------- */

    // Texto de instrucciones con un salto de linea
    const instructionText1 = this.add.text(
      330,
      80,
      "Haz click en el fondo de la pantalla\npara dirigir el movimiento de la nave",
      {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      }
    );

    // Posicionamiento de la imagen
    instructionText1.setOrigin(0.5);

    // Imagen de la nave dirigiendose a la posicion señala por el mouse
    const tutorialImage1 = this.add.image(330, 220, "box_move").setScale(0.8);
    tutorialImage1.setOrigin(0.5);

    // Texto de instrucciones con un salto de linea
    const instructionText2 = this.add.text(
      330,
      380,
      "Presiona la barra espaciadora para disparar\n y destruir los asteroides y naves enemigas",
      {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      }
    );

    // Posicionamiento de la imagen
    instructionText2.setOrigin(0.5);

    // Imagen de la nave disparando
    const tutorialImage2 = this.add.image(200, 550, "box_shoter").setScale(1);
    tutorialImage2.setOrigin(0.5);

    // Imagen de la nave disparando a un asteroide
    const tutorialImage3 = this.add.image(450, 550, "box_shoter_exp").setScale(1);
    tutorialImage3.setOrigin(0.5);
  }
}
