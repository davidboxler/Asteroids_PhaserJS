export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' })
    }

    overSound;
    create() {
        // this.overSound = this.sound.add('collectBad');
        // this.overSound.play();
        this.add.image(480, 320, "game-over")
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Level1'));
    }
}