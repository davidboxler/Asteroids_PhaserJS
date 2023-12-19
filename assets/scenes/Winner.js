export default class Winner extends Phaser.Scene {
  constructor() {
    super({ key: "Winner" });
  }

  init(data){
    this.score = data.scoreTotal | 0
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

    // Creamos el texto visible del puntaje
    this.scoreText = this.add.text(230, 680, "Puntos: " + this.score, {
      fontSize: "28px",
      fill: "white",
      fontStyle: "bold",
      backgroundColor: "black",
    });

    this.add
      .image(340, 500, "win")
      .setInteractive()
      .on("pointerdown", () => this.scene.start("Creditos"));
  }
}
