export default class Level1 extends Phaser.Scene {
  constructor() {
    /* ---------- CONSTRUCTOR DE LA SCENA ----------- */
    super({ key: "Level1" });
  }

  /* ---------- INICIAR VARIBLES GLOBALES ----------- */
  init() {
    this.rockCreationEvent;
    this.initialTime = 15;
    this.timeLeft = this.initialTime;
    this.initialScore = 0;
    this.scorePlayer = this.initialScore;
    this.scoreTotal = 0;
    this.playerLifes = 3;
    this.gameOver = false;
    this.lives = []; // Array con la cantidad de vidas
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
    // Establecer que la nave del jugador aparezca en el centro de la pantalla
    this.player = this.physics.add
      .sprite(this.cameras.main.centerX, this.cameras.main.centerY, "ship1")
      .setScale(0.8);

    // Funcion para desactivar la colisión de la nave con los límites del mundo
    this.player.body.collideWorldBounds = false;

    // Atributo para sdaber si la nave está en movimiento y en que coordenadas para usar en la funcion pausar
    this.player.isMoving = true;
    // Coordenadas de la iniciales de la nave
    this.player.originalVelocity = {
      x: this.player.body.velocity.x,
      y: this.player.body.velocity.y,
    };

    // Agrega el evento de clic del mouse para mover la nave
    this.background.on("pointerdown", this.handleBackgroundClickMove, this);

    // Agrega el evento de la barra espaciadora para disparar
    this.input.keyboard.on("keydown-SPACE", this.handleSpacebar, this);

    // Funcion para hacer que la camara siga al jugador cuando se desplaza por el mundo del juego
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

    /* ---------- CONFIGURACION DEL TIMER ----------- */
    // Creamos el texto visible del timer
    this.timeText = this.add.text(380, 30, "Tiempo: " + this.timeLeft, {
      fontSize: "28px",
      fill: "white",
      fontStyle: "bold",
      backgroundColor: "black",
    });
    // Agregamos el evento del timer al juego
    this.time.addEvent({
      delay: 1000,
      callback: this.timer,
      callbackScope: this,
      loop: true,
    });

    /* ---------- CONFIGURACION DEL TIMER ----------- */
    // Creamos el texto visible del puntaje
    this.scoreText = this.add.text(400, 920, "Puntos: " + this.scoreTotal, {
      fontSize: "28px",
      fill: "white",
      fontStyle: "bold",
      backgroundColor: "black",
    });
  }

  /* ---------- FUNCION PARA CREAR LOS ATEROIDES ----------- */
  makeRocks() {
    if (this.rockGroup.getChildren().length === 0) {
      // Crear un grupo de físicas para las rocas
      this.rockGroup = this.physics.add.group({
        key: "rocks",
        frame: [0, 1, 2],
        frameQuantity: 6,
        bounceX: 1,
        bounceY: 1,
        angularVelocity: 1,
        collideWorldBounds: false,
      });

      this.rockGroup.children.iterate(
        function (child) {
          // Definir la distancia desde la nave principal (ajusta el valor según tus necesidades)
          var distanceFromPlayer = 300;

          // Calcular un ángulo aleatorio para la posición en torno a la nave
          var angle = Math.random() * Math.PI * 2;

          // Calcular las coordenadas a una distancia específica de la nave
          var xx = this.player.x + distanceFromPlayer * Math.cos(angle);
          var yy = this.player.y + distanceFromPlayer * Math.sin(angle);

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
          var speed = Math.floor(Math.random() * 150) + 10;
          child.body.setVelocity(vx * speed, vy * speed);

          // Configura la propiedad originalVelocity
          child.originalVelocity = { x: vx * speed, y: vy * speed };

          // Configurar el evento cuando una roca salga del mundo
          child.body.world.on(
            "worldbounds",
            function (body) {
              if (body.gameObject === child) {
                // Verificar en qué borde salió la roca y la hace aparecer en el lado opuesto
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
      this.audio.pause(); // Añadir la propiedad pause para detener el sonido
      this.musicButton.setTexture("btn_notSound"); // Cambia la textura del botón a 'musicOff'
    } else {
      this.audio.resume(); // Añadir la propiedad resume para reanudar el sonido
      this.musicButton.setTexture("btn_sound"); // Cambia la textura del botón a 'musicOn'
    }
  }

  timer() {
    if (!this.is_pause) {
      this.timeLeft--;

      // Actualiza el texto del temporizador
      this.timeText.setText("Tiempo: " + this.timeLeft);
    }
  }

  /* ---------- FUNCION PARA ACTIVAR O DESACTIVAR LA PAUSA ----------- */
  // Función que maneja el clic en el botón de pausa/reanudar
  clickPause() {
    // Cambiar el estado de pausa a su opuesto
    this.is_pause = !this.is_pause;

    // Verificar si el juego está en modo pausa
    if (this.is_pause) {
      // Cambiar la textura del botón a "btn_play" (indicando reanudar)
      this.pauseButton.setTexture("btn_play");
      // Ejecutar la función para pausar el juego
      this.startPause();
    } else {
      // Si el juego no está en pausa, cambiar la textura del botón a "btn_pause" (indicando pausa)
      this.pauseButton.setTexture("btn_pause");
      // Ejecutar la función para reanudar el juego
      this.endPause();
    }
  }

  /* ---------- FUNCION PARA DETENER TODOS LOS OBJETOS DEL JUEGO ----------- */
  // Función para detener el movimiento de las balas, las rocas y la nave del jugador durante la pausa
  startPause() {
    // Detener el movimiento de cada bala y establecer su velocidad a cero
    this.bulletGroup.children.iterate((bullet) => {
      bullet.isMoving = false;
      bullet.body.velocity.setTo(0, 0);
    });

    // Detener el movimiento de cada roca y establecer su velocidad a cero
    this.rockGroup.children.iterate((rock) => {
      rock.isMoving = false;
      rock.body.velocity.setTo(0, 0);
    });

    // Detener el movimiento de la nave del jugador y establecer su velocidad a cero
    this.player.isMoving = false;
    this.player.body.velocity.setTo(0, 0);

    // Verificar si hay un temporizador y pausarlo si existe
    if (this.timer) {
      this.timer.paused = true;
    }

    // Almacenar si las balas, las rocas y la nave del jugador fueron destruidas antes de la pausa
    this.isBulletDestroyed = this.bulletGroup.countActive() === 0;
    this.isRockDestroyed = this.rockGroup.countActive() === 0;
    this.isPlayerDestroyed = !this.player.active;
  }
  /* ---------- FUNCION PARA REACTIVAR TODOS LOS OBJETOS DEL JUEGO ----------- */
  // Función para reanudar el movimiento de las balas, las rocas y la nave del jugador después de la pausa
  endPause() {
    // Reanudar el movimiento de cada bala y restaurar su velocidad original si no fue destruida antes de la pausa
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

    // Reanudar el movimiento de cada roca y restaurar su velocidad original si no fue destruida antes de la pausa
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

    // Reanudar el movimiento de la nave del jugador y restaurar su velocidad original si no fue destruida antes de la pausa
    if (this.player && this.player.body && !this.isPlayerDestroyed) {
      this.player.isMoving = true;
      if (this.player.body.velocity) {
        this.player.body.velocity.setTo(
          this.player.originalVelocity.x,
          this.player.originalVelocity.y
        );
      }
    }

    // Verificar si hay un temporizador y reanudarlo si existe
    if (this.timer) {
      this.timer.paused = false;
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
    for (let i = 0; i < 3; i++) {
      // Se recorre el array y se muestran mini naves en la pantalla simulando la cant de vidas
      const life = this.add
        .sprite(0, 0, "ship1")
        .setOrigin(1.4, -2.5 - i * 1.3);
      life.setScale(0.4);
      life.rotation = Phaser.Math.DegToRad(270);
      this.lives.push(life);
    }
  }

  /* ---------- FUNCION GAME OVER ----------- */
  downPlayer() {
    this.playerLifes--;

    // Si el jugador aún tiene vidas, oculta o elimina una de las imágenes de makeInfo
    if (this.playerLifes > 0) {
      const lifeToRemove = this.lives.pop(); // Elimina la última vida de la lista
      lifeToRemove.destroy(); // Elimina la imagen de la vida
    }
    // Comprobar la cantidad de vidas que aún tiene el jugador
    if (this.playerLifes === 0) {
      this.gameOver = true;
    }
  }

  /* ---------- FUNCION PARA DESTRUIR LOS ASTEROIDES AL IMPACTAR CON EL JUGADOR ----------- */
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

    // Suma un puntaje aleatorio entre 90 y 110 cuando el jugador destruye un asteroide
    this.scorePlayer += 100;
    this.scoreTotal += 100;

    // Actualizar el texto del puntaje en pantalla
    this.scoreText.setText("Puntaje: " + this.scoreTotal);
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
        this.makeBullet(); // Llamada a la funcion para crear los disparos de la nave
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
    this.physics.moveTo(this.player, targetX, targetY, 130);
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
    var bullet = this.physics.add.sprite(
      this.player.x + dirObj.tx * 30,
      this.player.y + dirObj.ty * 30,
      "bullet"
    );
    this.bulletGroup.add(bullet);
    bullet.angle = this.player.angle;
    // Configura la propiedad originalVelocity
    bullet.originalVelocity = { x: dirObj.tx * 250, y: dirObj.ty * 250 };

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

  // Función para actualizar la visualización de las vidas en la pantalla
  updateLivesDisplay() {
    // Agrega una nueva nave en la pantalla simulando la vida adicional
    const newLife = this.add
      .sprite(0, 0, "ship1")
      .setOrigin(1.4, -2.5 - this.lives.length * 1.3);
    newLife.setScale(0.4);
    newLife.rotation = Phaser.Math.DegToRad(270);
    this.lives.push(newLife);
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

    if (this.gameOver) {
      this.scene.start("GameOver", {
        scoreTotal: this.scoreTotal,
        sceneName: this.scene.key
      });
      this.timeLeft = 10;
    }

    if (this.timeLeft === 0 && this.playerLifes > 0) {
      this.audio.stop();
      this.scene.start("Level2", {
        scoreTotal: this.scoreTotal,
        scorePlayer: this.scorePlayer,
        playerLifes: this.playerLifes,
      });
      this.timeLeft = 10;
    }

    // Verificar si el jugador ha alcanzado ciertos múltiplos de puntos
    if (this.scorePlayer >= 1000) {
      this.scorePlayer = 0; // Reiniciar el puntaje para evitar que esta condición se cumpla repetidamente
      this.playerLifes += 1; // Incrementar las vidas
      this.updateLivesDisplay(); // Actualizar la visualización de las vidas
    }
  }
}
