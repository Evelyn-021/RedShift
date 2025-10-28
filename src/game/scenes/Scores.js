import Phaser from "phaser";

export default class Scores extends Phaser.Scene {
  constructor() {
    super("Scores");
  }

  create() {
    this.add
      .text(400, 100, "Top 10 Scores", {
        fontSize: 48,
      })
      .setOrigin(0.5);

    // agregar los 10 mejores highscore
    this.firebase.getHighScores().then((scores) => {
      let scrollY = 200;
      scores.forEach((doc) => {
        this.add
          .text(400, scrollY, `${doc.name} - ${doc.score}`, {
            fontSize: 24,
          })
          .setOrigin(0.5);
        scrollY += 30;
      });
    });

    this.add
      .text(400, 500, "Volver al juego", {
        fontSize: 24,
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("game");
      });
  }
}