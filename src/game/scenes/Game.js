import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create() {
    this.add.image(400, 300, "sky");

    // agregar un texto en la esquna superior izquierda con el nombre del usuario
    const user = this.firebase.getUser();
    this.add.text(10, 10, user.displayName || user.uid);

    // agregar un texto en la esquna superior derecha con el puntaje del usuario
    this.score = 0;
    this.textScore = this.add.text(600, 10, `Score: ${this.score}`);

    const logo = this.physics.add
      .image(400, 100, "logo")
      .setInteractive()
      .on("pointerdown", () => {
        const random = Math.random();
        if (random > 0.5) {
          if (this.score <= 0) {
            this.score = 10;
          } else {
            this.score = Math.round(this.score * random);
          }
        } else {
          const operator = Math.random() > 0.5 ? 1 : -1;

          if (logo.body.velocity.y < 0) {
            this.score += operator * 100;
            logo.setTint(0x00ff00);
            this.time.delayedCall(1000, () => {
              logo.setTint(0xffffff);
            });
            logo.setVelocity(100, 200);
          } else {
            this.score += operator * 100;
            logo.setTint(0xff0000);
            this.time.delayedCall(1000, () => {
              logo.setTint(0xffffff);
            });
            logo.setVelocity(100, -200);
          }
        }
        this.textScore.setText(`Score: ${this.score}`);
      });

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    // add green rectangle for collider and asign physics
    const floor = this.add.rectangle(400, 600, 800, 20, 0x00ff00);
    this.physics.add.existing(floor, true);

    this.timeInSeconds = 10;
    this.textTime = this.add.text(400, 10, `Time: ${this.timeInSeconds}`);
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeInSeconds -= 1;
        this.textTime.setText(`Time: ${this.timeInSeconds}`);
      },
      loop: true,
    });

    this.gameOver = false;
  }

  update() {
    if (this.timeInSeconds <= 0 && !this.gameOver) {
      this.gameOver = true;
      this.physics.pause();
      this.cameras.main.fadeOut(1000);
      this.scene.pause("game");

      const user = this.firebase.getUser();
      this.firebase.saveGameData(user.uid, {
        score: this.score,
        time: this.timeInSeconds,
      });

      // si el puntaje es mayor al puntaje mas alto, agregarlo a la lista de high scores
      this.firebase.getHighScores().then((highScores) => {
        const highScore = highScores[0] || { score: 0 };
        if (this.score > highScore.score) {
          this.firebase
            .addHighScore(user.displayName || user.uid, this.score)
            .then(() => {
              this.scene.start("Scores");
            });
        } else {
          this.scene.start("Scores");
        }
      });
    }
  }
}