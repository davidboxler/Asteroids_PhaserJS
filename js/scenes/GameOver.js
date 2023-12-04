export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
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

    this.add
      .image(340, 500, "game-over")
      .setInteractive()
      .on("pointerdown", () => this.scene.start("Menu"));
  }
}
