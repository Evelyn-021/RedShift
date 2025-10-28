import Phaser from "phaser";

export default class Registro extends Phaser.Scene {
  constructor() {
    super("Registro");
  }

  create() {
    // 🔥 Obtener el plugin de Firebase
    this.firebase = this.plugins.get("FirebasePlugin");

    // Fondo simple con color
    this.cameras.main.setBackgroundColor("#8c00ffff");

    // Título
    this.add.text(450, 100, "Registro", {
      fontFamily: "Times New Roman",
      fontSize: 55,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Subtítulo
    this.add.text(450, 190, "Elegí cómo querés ingresar", {
      fontFamily: "Times New Roman",
      fontSize: 25,
      color: "#eaf3ff",
    }).setOrigin(0.5);

    // 🧡 Email y contraseña
    this.add.text(450, 250, "Ingresar con Email y contraseña", {
      fontFamily: "Times New Roman",
      fontSize: 24,
      color: "#ffff00",
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        const email = prompt("📧 Email:");
        const password = prompt("🔑 Contraseña:");
        this.firebase
          .signInWithEmail(email, password)
          .then(() => this.scene.start("Game"))
          .catch(() => {
            const crearUsuario = window.confirm(
              "Email no encontrado.\n¿Querés crear un usuario nuevo?"
            );
            if (crearUsuario) {
              this.firebase
                .createUserWithEmail(email, password)
                .then(() => this.scene.start("MainMenu"))
                .catch((err) => console.log("Error al crear usuario:", err));
            }
          });
      });

    // 🩵 Anónimo
    this.add.text(450, 320, "Ingresar como Invitado", {
      fontFamily: "Times New Roman",
      fontSize: 24,
      color: "#ffffff",
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.firebase
          .signInAnonymously()
          .then(() => this.scene.start("MainMenu"))
          .catch((err) => console.log("Error anónimo:", err));
      });

    // 🔵 Google
    this.add.text(450, 400, "Ingresar con Google", {
      fontFamily: "Times New Roman",
      fontSize: 24,
      color: "#00ffcc",
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.firebase
          .signInWithGoogle()
          .then(() => this.scene.start("MainMenu"))
          .catch((err) => console.log("Error con Google:", err));
      });

    // ⚫ GitHub
    this.add.text(450, 480, "Ingresar con GitHub", {
      fontFamily: "Times New Roman",
      color: "#dddddd",
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.firebase
          .signInWithGithub()
          .then(() => this.scene.start("MainMenu"))
          .catch((err) => console.log("Error con GitHub:", err));
      });

    // 🩶 Firma Red Studio
    this.add.text(450, 560, "© Red Studio 2025", {
      fontFamily: "Times New Roman",
      fontSize: 18,
      color: "#ffffff",
    }).setOrigin(0.5);
  }
}
