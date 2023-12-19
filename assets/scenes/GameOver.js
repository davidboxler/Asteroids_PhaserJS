export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  init(data) {
    this.score = data.scoreTotal | 0;
    this.sceneName = data.sceneName;
  }

  create() {
    console.log(this.sceneName);
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
    this.scoreText = this.add.text(245, 580, "Puntos: " + this.score, {
      fontSize: "28px",
      fill: "white",
      fontStyle: "bold",
      backgroundColor: "black",
    });

    this.add.image(340, 400, "game-over")

    this.btnBack = this.add
      .image(500, 880, "btn_back")
      .setScale(0.5)
      .setInteractive()
      .on("pointerdown", () =>
        this.scene.start("Menu")
      );

    // Para que el botón no se desplace con la cámara
    this.btnBack.setScrollFactor(0);

    // Agregar evento al boton para que aparezca el efecto del cursor clic
    this.btnBack.on("pointerover", this.handleButtonOver, this);
    // Agregar evento al boton para que desaparezca el efecto del cursor clic
    this.btnBack.on("pointerout", this.handleButtonOut, this);

    
    this.btnRestart = this.add
      .image(140, 880, "btn_restart")
      .setScale(0.5)
      .setInteractive()
      .on("pointerdown", () =>
        this.scene.start(`${this.sceneName.toString()}`)
      );

    this.btnRestart.visible = false  

    if(this.sceneName.toString() === "Level1") {
      this.btnRestart.visible = true
    }

    // Para que el botón no se desplace con la cámara
    this.btnRestart.setScrollFactor(0);

    // Agregar evento al boton para que aparezca el efecto del cursor clic
    this.btnRestart.on("pointerover", this.handleButtonOver, this);
    // Agregar evento al boton para que desaparezca el efecto del cursor clic
    this.btnRestart.on("pointerout", this.handleButtonOut, this);
  }

  /* ---------- FUNCION PARA HACER EL EFECTO CLIC POINTER ----------- */
  handleButtonOver(pointer, localX, localY, event) {
    document.body.style.cursor = "pointer";
  }

  /* ---------- FUNCION PARA QUITAR EL EFECTO CLIC POINTER ----------- */
  handleButtonOut(pointer, event) {
    document.body.style.cursor = "default";
  }
}
