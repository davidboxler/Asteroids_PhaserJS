export default class Help extends Phaser.Scene {
    audio;
  
    constructor() {
      super("Help");
    }
  
    create() {
      // Fondo
      this.background = this.add.image(0, 0, "fondo").setOrigin(0, 0);
  
      // Capa de color negro semitransparente
      const overlay = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000000);
      overlay.setOrigin(0, 0);
      overlay.setAlpha(0.5); // Ajusta la opacidad según sea necesario
  
      // Botón
      let btnJugar = this.physics.add.staticGroup();
      btnJugar
        .create(340, 650, "btn_start")
        .setScale(0.55)
        .refreshBody()
        .setInteractive()
        .on("pointerdown", () => this.scene.start("Level1"));
  
      // Texto de instrucciones
      const instructionText = this.add.text(400, 100, "Presiona la barra espaciadora para disparar", {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center'
      });
      instructionText.setOrigin(0.5);
  
      // Imagen de la nave disparando
      const spaceshipImage = this.add.image(400, 300, "btn_play").setScale(0.8);
      spaceshipImage.setOrigin(0.5);
    }
  }