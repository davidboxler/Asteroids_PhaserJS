export default class Level1 extends Phaser.Scene {
  constructor() {
    /* ---------- CONSTRUCTOR DE LA SCENA ----------- */
    super({ key: "Level1" });
  }

  create() {
    /* ---------- CARGA DE SONIDOS ----------- */
    this.audio = this.sound.add("soundTrack", { loop: true });
    this.laserPlayer = this.sound.add("laserPlayer");
    this.explosionSound = this.sound.add("explosion");
    this.laserEnemy = this.sound.add("laserEnemy");
    this.audio.play();
    this.audio.setVolume(0.2);
    this.laserPlayer.setVolume(0.5);
    this.explosionSound.setVolume(0.5);
    this.laserEnemy.setVolume(0.5);

    /* ---------- CONFIGURACION DEL FONDO ----------- */
    // Configura el fondo con el ancho y alto predeterminados
    this.background = this.add.image(0, 0, "fondo").setOrigin(0, 0);
    this.background.setInteractive();

    /* ---------- CONFIGURACION DE LA NAVE DEL JUGADOR ----------- */
    this.playerShields = 100;
    this.playerWon = true;
    // Establecer que la nave del jugador aparezca en el centro de la pantalla
    this.player = this.physics.add
      .sprite(this.cameras.main.centerX, this.cameras.main.centerY, "ship1")
      .setScale(0.8);

    this.player.body.collideWorldBounds = false;

    this.player.isMoving = true;
    this.player.originalVelocity = {
      x: this.player.body.velocity.x,
      y: this.player.body.velocity.y,
    };

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

    /* ---------- CONFIGURACION DEL BOTON MUSICA Y SONIDO ----------- */
    this.musicButton = this.add
      .image(16, 16, "btn_sound")
      .setOrigin(0, 0)
      .setScale(0.35)
      .setInteractive();

    // Para que el botón no se desplace con la cámara
    this.musicButton.setScrollFactor(0);

    // Agregar evento al boton para que aparezca el efecto del cursor clic
    this.musicButton.on("pointerover", this.handleButtonOver, this);
    // Agregar evento al boton para que desaparezca el efecto del cursor clic
    this.musicButton.on("pointerout", this.handleButtonOut, this);
    // Agregar evento de clic al botón de música
    this.musicButton.on("pointerdown", this.toggleMusic, this);

    /* ---------- CONFIGURACION DEL BOTON PAUSA ----------- */
    this.pauseButton = this.add
      .image(16, 16, "btn_pause")
      .setOrigin(-13, 0)
      .setScale(0.35)
      .setInteractive();

    this.pauseButton.setScrollFactor(0);

    // Agregar evento al boton para que aparezca el efecto del cursor clic
    this.pauseButton.on("pointerover", this.handleButtonOver, this);
    // Agregar evento al boton para que desaparezca el efecto del cursor clic
    this.pauseButton.on("pointerout", this.handleButtonOut, this);
    // Agregar evento de clic al botón de pausa
    this.pauseButton.on("pointerdown", this.clickPause, this);

    // Ajusta la cámara para que comience centrada en la posición inicial de la nave del jugador
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    /* ---------- CONFIGURACION DE LOS DISPAROS ----------- */
    // Agregar el grupo de los disparos
    this.bulletGroup = this.physics.add.group();

    // Iterar sobre las balas y establecer la propiedad isMoving y almacenar la velocidad original
    this.bulletGroup.children.iterate((bullet) => {
      bullet.isMoving = true;
      bullet.originalVelocity = {
        x: bullet.body.velocity.x,
        y: bullet.body.velocity.y,
      };
    });

    /* ---------- CONFIGURACION DE LOS ASTEROIDES ----------- */
    // Agregar el grupo de los asteroides
    this.rockGroup = this.physics.add.group();

    // Iterar sobre las rocas y establecer la propiedad isMoving y almacenar la velocidad original
    this.rockGroup.children.iterate((rock) => {
      rock.isMoving = true;
      rock.originalVelocity = {
        x: rock.body.velocity.x,
        y: rock.body.velocity.y,
      };
    });

    // Propiedades para almacenar si las balas y las rocas fueron destruidas antes de la pausa
    this.isBulletDestroyed = false;
    this.isRockDestroyed = false;

    /* ---------- LLAMADA A LA FUNCION PARA CREAR LOS ASTEROIDES ----------- */
    this.makeRocks();

    /* ---------- CONFIGURACION DE LAS ANIMACIONES ----------- */
    // Agregar animacion de explosion
    var animationExplosion = this.anims.generateFrameNumbers("exp");
    var antExplo = animationExplosion.slice();
    antExplo.reverse();
    var anExp = antExplo.concat(animationExplosion);
    this.anims.create({
      key: "boom",
      frames: anExp,
      frameRate: 48,
      repeat: false,
    });

    // Agregar animacion de efecto al hacer clic para dirigir la nave
    var animationSpace = this.anims.generateFrameNumbers("effect");
    var antSpace = animationSpace.slice();
    antSpace.reverse();
    var anSpac = antSpace.concat(animationSpace);
    this.anims.create({
      key: "space",
      frames: anSpac,
      frameRate: 48,
      repeat: false,
    });

    // Agregar evento para retrasar el tiempo entre disparo y disparo
    this.shootTimer = this.time.addEvent({
      delay: 300,
      callback: this.allowShooting,
      callbackScope: this,
      loop: true,
    });

    /* ---------- CONFIGURACION DE LA INFORMACION DEL JUEGO ----------- */
    this.makeInfo();

    /* ---------- CONFIGURACION DE LAS COLICIONES ----------- */
    this.setColliders();
  }

  /* ---------- FUNCION PARA CREAR LOS ATEROIDES ----------- */
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

          // Configura la propiedad originalVelocity
          child.originalVelocity = { x: vx * speed, y: vy * speed };

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

  /* ---------- FUNCION PARA HACER EL EFECTO CLIC POINTER ----------- */
  handleButtonOver(pointer, localX, localY, event) {
    document.body.style.cursor = "pointer";
  }

  /* ---------- FUNCION PARA QUITAR EL EFECTO CLIC POINTER ----------- */
  handleButtonOut(pointer, event) {
    document.body.style.cursor = "default";
  }

  /* ---------- FUNCION PARA ACTIVAR O DESACTIVAR EL SONIDO ----------- */
  toggleMusic() {
    if (this.audio.isPlaying) {
      this.audio.pause();
      this.musicButton.setTexture("btn_notSound"); // Cambia la textura del botón a 'musicOff'
    } else {
      this.audio.resume();
      this.musicButton.setTexture("btn_sound"); // Cambia la textura del botón a 'musicOn'
    }
  }

  /* ---------- FUNCION PARA ACTIVAR O DESACTIVAR LA PAUSA ----------- */
  clickPause() {
    this.is_pause = !this.is_pause;

    if (this.is_pause) {
      this.pauseButton.setTexture("btn_play");
      this.startPause();
    } else {
      this.pauseButton.setTexture("btn_pause");
      this.endPause();
    }
  }

  /* ---------- FUNCION PARA DETENER TODOS LOS OBJETOS DEL JUEGO ----------- */
  startPause() {
    // Detener el movimiento de las balas, las rocas y la nave del jugador
    this.bulletGroup.children.iterate((bullet) => {
      bullet.isMoving = false;
      bullet.body.velocity.setTo(0, 0);
    });

    this.rockGroup.children.iterate((rock) => {
      rock.isMoving = false;
      rock.body.velocity.setTo(0, 0);
    });

    this.player.isMoving = false;
    this.player.body.velocity.setTo(0, 0);

    // Almacenar si las balas, las rocas y la nave del jugador fueron destruidas antes de la pausa
    this.isBulletDestroyed = this.bulletGroup.countActive() === 0;
    this.isRockDestroyed = this.rockGroup.countActive() === 0;
    this.isPlayerDestroyed = !this.player.active;
  }

  /* ---------- FUNCION PARA REACTIVAR TODOS LOS OBJETOS DEL JUEGO ----------- */
  endPause() {
    // Reanudar el movimiento de las balas, las rocas y la nave del jugador y restaurar si fueron destruidas antes de la pausa
    this.bulletGroup.children.iterate((bullet) => {
      if (bullet && bullet.body && !this.isBulletDestroyed) {
        bullet.isMoving = true;
        if (bullet.body.velocity) {
          bullet.body.velocity.setTo(
            bullet.originalVelocity.x,
            bullet.originalVelocity.y
          );
        }
      }
    });

    this.rockGroup.children.iterate((rock) => {
      if (rock && rock.body && !this.isRockDestroyed) {
        rock.isMoving = true;
        if (rock.body.velocity) {
          rock.body.velocity.setTo(
            rock.originalVelocity.x,
            rock.originalVelocity.y
          );
        }
      }
    });

    if (this.player && this.player.body && !this.isPlayerDestroyed) {
      this.player.isMoving = true;
      if (this.player.body.velocity) {
        this.player.body.velocity.setTo(
          this.player.originalVelocity.x,
          this.player.originalVelocity.y
        );
      }
    }
  }

  /* ---------- FUNCION DE COLICIONES DEL JUEGO ----------- */
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

  /* ---------- FUNCION PARA MOSTRAR LA INFORMACION DEL JUEGO ----------- */
  makeInfo() {
    this.text1 = this.add.text(0, 0, "Shields\n100", {
      fontSize: game.config.width / 30,
      align: "center",
      backgroundColor: "#000000",
    });

    this.text1.setOrigin(20, 20);
  }

  /* ---------- FUNCION GAME OVER ----------- */
  downPlayer() {
    this.playerShields--;
    this.text1.setText("Shields\n" + this.playerShields);
    if (this.playerShields == 0) {
      this.playerWon = false;
      this.scene.start("GameOver");
    }
  }

  /* ---------- FUNCION PARA DESTRUIR LOS ASTERIODES ----------- */
  rockHitPlayer(ship, rock) {
    var explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    if (this.audio.isPlaying) {
      this.explosionSound.play();
    }

    rock.destroy();
    this.makeRocks();
    this.downPlayer();
  }

  damagePlayer(player, bullet) {
    var explosion = this.add.sprite(this.player.x, this.player.y, "exp");
    explosion.play("boom");
    if (this.audio.isPlaying) {
      this.explosionSound.play();
    }

    bullet.destroy();
    this.downPlayer();
  }

  /* ---------- FUNCION PARA DESTRUIR LOS ASTERIODES ----------- */
  destoryRock(bullet, rock) {
    bullet.destroy();
    var explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    if (this.audio.isPlaying) {
      this.explosionSound.play();
    }

    rock.destroy();
    this.makeRocks();
  }

  /* ---------- FUNCION PARA RETRESAR LOS DISPAROS ----------- */
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
  
  /* ---------- FUNCION PARA CONFIGURAR EL MOVIENTO DE LA NAVE CON EL CLIC ----------- */
  handleBackgroundClickMove(pointer) {
    if (!this.is_pause) {
      this.handleMovePlayer(pointer.x, pointer.y);
      this.addClickEffect(pointer.x, pointer.y);
    }
  }

  /* ---------- FUNCION PARA CONFIGURAR EL EFECTO DEL CLIC EN EL ESPACIO ----------- */
  addClickEffect(x, y) {
    const clickEffect = this.add.sprite(x, y, "effect");
    clickEffect.play("space");
    // Configura la animación o ajusta la escala, alfa, etc., según tus necesidades
    clickEffect.setScale(0.8);
    clickEffect.setAlpha(1);

    // Agrega una animación, si es necesario
    this.tweens.add({
      targets: clickEffect,
      alpha: 0,
      duration: 1000, // Duración de la animación en milisegundos
      ease: "Power2",
      onComplete: () => {
        // Elimina el sprite después de que termine la animación
        clickEffect.destroy();
      },
    });
  }
  /* ---------- FUNCION PARA CONFIGURAR EL DISPARO CON LA BARRA ESPACIADORA ----------- */
  handleSpacebar(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado de la barra espaciadora (como hacer scroll)

    // Verifica si el juego está en pausa y evita disparar
    if (!this.is_pause) {
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

  /* ---------- FUNCION PARA CONFIGURAR LOS DISPAROS ----------- */
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
    // Configura la propiedad originalVelocity
    bullet.originalVelocity = { x: dirObj.tx * 200, y: dirObj.ty * 200 };

    bullet.body.setVelocity(
      bullet.originalVelocity.x,
      bullet.originalVelocity.y
    );
    if (this.audio.isPlaying) {
      this.laserPlayer.play();
    }
  }

  /* ---------- FUNCION PARA CONFIGURAR EL ANGULO DE LOS DISPAROS ----------- */
  getDirFromAngle(angle) {
    var rads = (angle * Math.PI) / 180;
    var tx = Math.cos(rads);
    var ty = Math.sin(rads);
    return {
      tx,
      ty,
    };
  }

  /* ---------- FUNCION PARA CONFIGURAR LOS LIMITES DEL JUEGO (ASTEROIDES) ----------- */
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

  /* ---------- FUNCION PARA CONFIGURAR LOS LIMITES DEL JUEGO (NAVES) ----------- */
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

  /* ---------- CONFIGURACION DEL UPDATE DEL JUEGO ----------- */
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
