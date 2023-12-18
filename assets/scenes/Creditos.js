export default class Creditos extends Phaser.Scene {
    constructor() {
      super({ key: "Creditos" });
    }
  
    create() {
      // Cargar el video
      this.cinematicVideo = this.add.video(340, 500, "creditos");
      // Ajustar la escala del video
      this.cinematicVideo.setScale(0.5); // Puedes ajustar el valor según tus necesidades
  
      // Establecer el origen en el centro del video
      this.cinematicVideo.setOrigin(0.5, 0.5);
  
      this.cinematicVideo.play();
  
      // Esperar a que termine el video y luego iniciar la escena "Level1"
      this.cinematicVideo.on("complete", () => {
        this.scene.start("Menu");
      });
    }
  }
  