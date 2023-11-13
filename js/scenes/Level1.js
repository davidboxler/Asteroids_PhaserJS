export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }

  create() {
    this.background = this.add
      .image(0, 0, "fondoGalaxia")
      .setOrigin(0, 0.5)
      .setScale(1.5);
    this.background.setInteractive();

    this.enemyShields = 5;
    this.playerShields = 100;
    this.playerWon=true;
    this.player = this.physics.add.sprite(100, 450, "ship");
    this.player.body.collideWorldBounds = true;
    this.background.on("pointerup", this.handleBackgroundClick, this);
    this.background.on("pointerdown", this.onDown, this);

    this.cameras.main.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight
    );
    this.cameras.main.startFollow(this.player, true);
    this.bulletGroup = this.physics.add.group();
    this.ebulletGroup = this.physics.add.group();
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

    this.enemy = this.physics.add.sprite(500, 200, "eship");
    this.enemy.body.collideWorldBounds = true;
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
        collideWorldBounds: true,
      });

      this.rockGroup.children.iterate(
        function (child) {
          var xx = Math.floor(Math.random() * this.background.displayWidth);
          var yy = Math.floor(Math.random() * this.background.displayHeight);
          child.x = xx;
          child.y = yy;
          var vx = Math.floor(Math.random() * 2) - 1;
          var vy = Math.floor(Math.random() * 2) - 1;
          if (vx == 0 && vy == 0) {
            vx = 1;
            vy = 1;
          }
          var speed = Math.floor(Math.random() * 200) + 10;
          child.body.setVelocity(vx * speed, vy * speed);
        }.bind(this)
      );
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
      this.ebulletGroup,
      this.rockGroup,
      this.destoryRock,
      null,
      this
    );
    this.physics.add.collider(
      this.bulletGroup,
      this.enemy,
      this.damageEnemy,
      null,
      this
    );
    this.physics.add.collider(
      this.ebulletGroup,
      this.player,
      this.damagePlayer,
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
    this.physics.add.collider(
      this.rockGroup,
      this.enemy,
      this.rockHitEnemy,
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
    this.text2 = this.add.text(0, 0, "Enemy Shields\n100", {
      fontSize: game.config.width / 30,
      align: "center",
      backgroundColor: "#000000",
    });
    this.text1.setOrigin(20, 20);
    this.text2.setOrigin(-3.1, -0.5);
  }
  downPlayer() {
    this.playerShields--;
    this.text1.setText("Shields\n" + this.playerShields);
    if(this.playerShields == 0) {
        this.playerWon=false;
        this.scene.start("GameOver");
    }
  }
  downEnemy() {
    this.enemyShields--;
    this.text2.setText("Enemy Shields\n" + this.enemyShields);
    if(this.enemyShields == 0) {
        this.playerWon=true;
        this.scene.start("GameOver");
    }
  }
  rockHitPlayer(ship, rock) {
    var explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    rock.destroy();
    this.makeRocks();
    this.downPlayer();
  }
  rockHitEnemy(ship, rock) {
    var explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    rock.destroy();
    this.makeRocks();
    this.downEnemy();
  }
  damagePlayer(player, bullet) {
    var explosion = this.add.sprite(this.player.x, this.player.y, "exp");
    explosion.play("boom");
    bullet.destroy();
    this.downPlayer();
  }
  damageEnemy(player, bullet) {
    var explosion = this.add.sprite(bullet.x, bullet.y, "exp");
    explosion.play("boom");
    bullet.destroy();
    this.downEnemy();

    this.handleMoveEnemy();
  }
  destoryRock(bullet, rock) {
    bullet.destroy();
    var explosion = this.add.sprite(rock.x, rock.y, "exp");
    explosion.play("boom");
    rock.destroy();
    this.makeRocks();
  }
  getTimer() {
    var d = new Date();
    return d.getTime();
  }
  onDown() {
    this.downTimer = this.getTimer(); // Corregir el nombre de la variable
  }
  handleBackgroundClick(pointer) {
    const elapsed = Math.abs(this.downTimer - this.getTimer());
    console.log(elapsed);

    if (elapsed < 300) {
      this.handleMovePlayer(pointer.x, pointer.y);
      this.handleMoveEnemy();
    } else {
      this.makeBullet();
    }
  }
  handleMovePlayer(targetX, targetY) {
    this.physics.moveTo(this.player, targetX, targetY, 100);
    this.rotateSpriteTowards(this.player, targetX, targetY);
    this.tx = targetX;
    this.ty = targetY;

    // NAVE ENEMIGA
    const distX2 = Math.abs(this.player.x - targetX);
    const distY2 = Math.abs(this.player.y - targetY);

    if (distX2 > 30 && distY2 > 30) {
      this.handleMoveEnemy();
    }
  }
  handleMoveEnemy() {
    const angle = this.physics.moveTo(
      this.enemy,
      this.player.x,
      this.player.y,
      60
    );
    this.enemy.angle = Phaser.Math.RadToDeg(angle);
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
  }
  fireEBullet() {
    var elapsed = Math.abs(this.lastEBullet - this.getTimer());
    if (elapsed < 500) {
      return;
    }
    this.lastEBullet = this.getTimer();
    var ebullet = this.physics.add.sprite(
      this.enemy.x,
      this.enemy.y,
      "ebullet"
    );
    this.ebulletGroup.add(ebullet);
    ebullet.body.angularVelocity = 10;
    this.physics.moveTo(ebullet, this.player.x, this.player.y, 200);
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
  update() {
    //constant running loop
    if (this.player && this.enemy) {
      var distX = Math.abs(this.player.x - this.tx);
      var distY = Math.abs(this.player.y - this.ty);
      if (distX < 10 && distY < 10) {
        if (this.player.body) {
          this.player.body.setVelocity(0, 0);
        }
      }
      var distX2 = Math.abs(this.player.x - this.enemy.x);
      var distY2 = Math.abs(this.player.y - this.enemy.y);
      if (distX2 < game.config.width / 5 && distY2 < game.config.height / 5) {
        this.fireEBullet();
      }
    }
  }
}
