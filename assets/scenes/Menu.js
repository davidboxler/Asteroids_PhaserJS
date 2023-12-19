export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    this.background = this.add.image(0, 0, "fondo").setOrigin(0, 0);

    const imageTitulo = this.add.image(330, 300, "title").setScale(1);
    imageTitulo.setOrigin(0.5);

    this.btnJugar = this.add
      .image(340, 650, "btn_start")
      .setScale(0.55)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("Cinematica"));

    // Para que el botón no se desplace con la cámara
    this.btnJugar.setScrollFactor(0);

    // Agregar evento al boton para que aparezca el efecto del cursor clic
    this.btnJugar.on("pointerover", this.handleButtonOver, this);
    // Agregar evento al boton para que desaparezca el efecto del cursor clic
    this.btnJugar.on("pointerout", this.handleButtonOut, this);

    this.btnBack = this.add
      .image(340, 750, "btn_help")
      .setScale(0.55)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("Help"));

    // Para que el botón no se desplace con la cámara
    this.btnBack.setScrollFactor(0);

    // Agregar evento al boton para que aparezca el efecto del cursor clic
    this.btnBack.on("pointerover", this.handleButtonOver, this);
    // Agregar evento al boton para que desaparezca el efecto del cursor clic
    this.btnBack.on("pointerout", this.handleButtonOut, this);

    this.btnSalir = this.add
      .image(550, 900, "btn_salir")
      .setScale(0.45)
      .setInteractive()
      .on("pointerdown", () => window.close());

    // Para que el botón no se desplace con la cámara
    this.btnSalir.setScrollFactor(0);

    // Agregar evento al boton para que aparezca el efecto del cursor clic
    this.btnSalir.on("pointerover", this.handleButtonOver, this);
    // Agregar evento al boton para que desaparezca el efecto del cursor clic
    this.btnSalir.on("pointerout", this.handleButtonOut, this);
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
