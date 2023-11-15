export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }

  create() {
    /* ------------------------------- SOUNDS ------------------------ */

    this.audio = this.sound.add("soundTrack", { loop: true });
    this.laserPlayer = this.sound.add("laserPlayer");
    this.explosionSound = this.sound.add("explosion");
    this.laserEnemy = this.sound.add("laserEnemy");
    this.audio.play();
    this.audio.setVolume(0.2);
    this.laserPlayer.setVolume(0.5);
    this.explosionSound.setVolume(0.5);
    this.laserEnemy.setVolume(0.5);

    // Configura el fondo con el ancho y alto predeterminados
    this.background = this.add.image(0, 0, "fondo").setOrigin(0, 0);

    this.background.setInteractive();

    this.playerShields = 100;
    this.playerWon = true;

    // Asegúrate de que la nave del jugador aparezca en el centro de la pantalla
    this.player = this.physics.add
      .sprite(this.cameras.main.centerX, this.cameras.main.centerY, "ship")
      .setScale(0.8);
    this.player.body.collideWorldBounds = false;

    // Agrega el evento de clic del mouse para mover la nave
    this.background.on("pointerdown", this.handleBackgroundClickMove, this);

    // Agrega el evento de la barra espaciadora para disparar
    this.input.keyboard.on("keydown-SPACE", this.handleSpacebar, this);

    this.cameras.main.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight
    );

    // Ajusta la cámara para que comience centrada en la posición inicial de la nave del jugador
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.bulletGroup = this.physics.add.group();
    this.rockGroup = this.physics.add.group();
    this.makeRocks();

    var frameNames = this.anims.generateFrameNumbers("exp");
    var f2 = frameNames.slice();
    f2.reverse();
    var f3 = f2.concat(frameNames);
    this.anims.create({
      key: "boom",
      frames: f3,
      frameRate: 48,
      repeat: false,
    });
    this.shootTimer = this.time.addEvent({
      delay: 300,
      callback: this.allowShooting,
      callbackScope: this,
      loop: true,
    });
    this.makeInfo();
    this.setColliders();
  }

  makeRocks() {
    if (this.rockGroup.getChildren().length == 0) {
      this.rockGroup = this.physics.add.group({
        key: "rocks",
        frame: [0, 1, 2],
        frameQuantity: 5,
        bounceX: 1,
        bounceY: 1,
        angularVelocity: 1,
        collideWorldBounds: false, // Desactiva las colisiones con los límites del mundo para permitir que las rocas atraviesen
      });

      this.rockGroup.children.iterate(
        function (child) {
          var xx = Math.floor(Math.random() * this.background.displayWidth);
          var yy = Math.floor(Math.random() * this.background.displayHeight);
          child.x = xx;
          child.y = yy;

          // Cambia el tamaño de las rocas
          var scaleFactor = Math.random() * (1 - 0.5) + 0.5; // Tamaño aleatorio entre 0.5 y 1.5
          child.setScale(scaleFactor);

          var vx = Math.floor(Math.random() * 2) - 1;
          var vy = Math.floor(Math.random() * 2) - 1;
          if (vx == 0 && vy == 0) {
            vx = 1;
            vy = 1;
          }
          var speed = Math.floor(Math.random() * 200) + 10;
          child.body.setVelocity(vx * speed, vy * speed);

          // Configura el evento cuando una roca salga del mundo
          child.body.world.on(
            "worldbounds",
            function (body) {
              if (body.gameObject === child) {
                // Verifica en qué borde salió la roca y la hace aparecer en el lado opuesto
                if (body.blocked.down) {
                  child.y = 0;
                } else if (body.blocked.up) {
                  child.y = this.background.displayHeight;
                } else if (body.blocked.left) {
                  child.x = this.background.displayWidth;
                } else if (body.blocked.right) {
                  child.x = 0;
                }
              }
            },
            this
          );
        }.bind(this)
      );
      this.setColliders();
    }
  }

  setColliders() {
    this.physics.add.collider(this.rockGroup);
    this.physics.add.collider(
      this.bulletGroup,
      this.rockGroup,
      this.destoryRock,
      null,
      this
    );
    this.physics.add.collider(
      this.rockGroup,
      this.player,
      this.rockHitPlayer,
      null,
      this
    );
  }

  makeInfo() {
    this.text1 = this.add.text(0, 0, "Shields\n100", {
      fontSize: game.config.width / 30,
      align: "center",
      backgroundColor: "#000000",
    });

    this.text1.setOrigin(20, 20);
  }

  downPlayer() {
    this.playerShields--;
    this.text1.setText("Shields\n" + this.playerShields);
    if (this.playerShields == 0) {
      this.playerWon = false;
      this.scene.start("GameOver");
    }
  }

  rockHitPlayer(ship, rock) {
    var explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    this.explosionSound.play()

    rock.destroy();
    this.makeRocks();
    this.downPlayer();
  }

  damagePlayer(player, bullet) {
    var explosion = this.add.sprite(this.player.x, this.player.y, "exp");
    explosion.play("boom");
    this.explosionSound.play()

    bullet.destroy();
    this.downPlayer();
  }

  destoryRock(bullet, rock) {
    bullet.destroy();
    var explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    this.explosionSound.play()
    
    rock.destroy();
    this.makeRocks();
  }

  getTimer() {
    var d = new Date();
    return d.getTime();
  }

  onDown() {
    this.downTimer = this.getTimer();
  }

  allowShooting() {
    this.canShoot = true;
  }

  handleBackgroundClickMove(pointer) {
    this.handleMovePlayer(pointer.x, pointer.y);
  }

  // Agrega este método para manejar la barra espaciadora
  handleSpacebar(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado de la barra espaciadora (como hacer scroll)
    // Verificar si el temporizador permite el disparo
    const currentTime = this.getTimer();
    const delay = 500; // Establecer el tiempo de retraso deseado en milisegundos

    if (
      this.canShoot &&
      (!this.lastShotTime || currentTime - this.lastShotTime >= delay)
    ) {
      this.makeBullet();
      this.canShoot = false; // Desactivar el disparo hasta que pase el retraso
      this.lastShotTime = currentTime; // Actualizar el tiempo del último disparo

      // Configurar un retraso antes de permitir el próximo disparo
      this.time.delayedCall(delay, () => {
        this.canShoot = true;
      });
    }
  }

  handleMovePlayer(targetX, targetY) {
    this.physics.moveTo(this.player, targetX, targetY, 100);
    this.rotateSpriteTowards(this.player, targetX, targetY);
    this.tx = targetX;
    this.ty = targetY;
  }

  rotateSpriteTowards(sprite, targetX, targetY) {
    const angle = Phaser.Math.Angle.Between(
      sprite.x,
      sprite.y,
      targetX,
      targetY
    );
    sprite.angle = Phaser.Math.RadToDeg(angle);
  }

  makeBullet() {
    var dirObj = this.getDirFromAngle(this.player.angle);
    console.log(dirObj);
    var bullet = this.physics.add.sprite(
      this.player.x + dirObj.tx * 30,
      this.player.y + dirObj.ty * 30,
      "bullet"
    );
    this.bulletGroup.add(bullet);
    bullet.angle = this.player.angle;
    bullet.body.setVelocity(dirObj.tx * 200, dirObj.ty * 200);
    this.laserPlayer.play()
  }

  getDirFromAngle(angle) {
    var rads = (angle * Math.PI) / 180;
    var tx = Math.cos(rads);
    var ty = Math.sin(rads);
    return {
      tx,
      ty,
    };
  }

  checkRockPositions() {
    // Verificar si las rocas han salido por los bordes y ajustar su posición
    this.rockGroup.children.iterate((rock) => {
      if (rock.x < 0) {
        rock.x = this.background.displayWidth;
      } else if (rock.x > this.background.displayWidth) {
        rock.x = 0;
      }

      if (rock.y < 0) {
        rock.y = this.background.displayHeight;
      } else if (rock.y > this.background.displayHeight) {
        rock.y = 0;
      }
    });
  }

  checkPlayerPosition() {
    // Verificar si la nave ha salido por los bordes y ajustar su posición
    if (this.player.x < 0) {
      this.player.x = this.background.displayWidth;
    } else if (this.player.x > this.background.displayWidth) {
      this.player.x = 0;
    }

    if (this.player.y < 0) {
      this.player.y = this.background.displayHeight;
    } else if (this.player.y > this.background.displayHeight) {
      this.player.y = 0;
    }
  }

  update() {
    this.checkRockPositions();
    this.checkPlayerPosition();

    // Asegurar que las balas no se salgan del mundo
    this.bulletGroup.children.iterate((bullet) => {
      if (
        bullet &&
        (bullet.y < 0 || bullet.y > this.background.displayHeight)
      ) {
        bullet.destroy();
      }
    });
  }
}
