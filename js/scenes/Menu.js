export default class Menu extends Phaser.Scene {
  audio;
  constructor() {
    super("Menu");
  }

  create() {
    this.background = this.add.image(0, 0, "fondo").setOrigin(0, 0);

    let btnJugar = this.physics.add.staticGroup();
    btnJugar
      .create(340, 650, "btn_start")
      .setScale(0.55)
      .refreshBody()
      .setInteractive()
      .on("pointerdown", () => this.scene.start("Help"));
  }
}
