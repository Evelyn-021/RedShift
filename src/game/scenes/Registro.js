import Phaser from "phaser";

export default class Registro extends Phaser.Scene {
  constructor() {
    super("Registro");
  }

  preload() {
    this.load.image("iconAnon", "assets/image/icons/persona.png");
    this.load.image("iconGitHub", "assets/image/icons/github.png");
    this.load.image("iconGoogle", "assets/image/icons/google.png");
  }

  create() {
    const mode = import.meta.env.VITE_MODE;
    console.log(`🚀 Iniciando en modo: ${mode.toUpperCase()}`);

    if (mode === "arcade") {
      this.scene.start("MainMenu");
      return;
    }

    this.firebase = this.plugins.get("FirebasePlugin");
    this.cameras.main.setBackgroundColor("#0d1117");

    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    // 🔳 Panel con sombra simulada
    this.add.rectangle(cx + 5, cy + 5, 420, 460, 0x000000, 0.25);
    const panel = this.add.rectangle(cx, cy, 420, 460, 0xffffff);
    panel.setStrokeStyle(2, 0x30363d);

    // 🧾 Título
    this.add.text(cx, cy - 160, "Iniciar sesión", {
      fontFamily: "Arial",
      fontSize: 38,
      color: "#000",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // 🔑 Campos simulados
    this.add.rectangle(cx, cy - 80, 300, 40, 0xf6f8fa).setStrokeStyle(1, 0xd0d7de);
    this.add.text(cx - 120, cy - 90, "📧 Email", { fontFamily: "Arial", fontSize: 16, color: "#555" });

    this.add.rectangle(cx, cy - 20, 300, 40, 0xf6f8fa).setStrokeStyle(1, 0xd0d7de);
    this.add.text(cx - 140, cy - 30, "🔒 Contraseña", { fontFamily: "Arial", fontSize: 16, color: "#555" });

    // ❤️ Botón principal
    const boton = this.add.rectangle(cx, cy + 40, 200, 45, 0xdb0000)
      .setInteractive({ useHandCursor: true });
    this.add.text(cx, cy + 40, "Iniciar sesión", {
      fontFamily: "Arial",
      fontSize: 20,
      color: "#ffffff",
    }).setOrigin(0.5);

    // 🟣 Mensaje dinámico
    const message = this.add.text(cx, cy + 90, "", {
      fontFamily: "Arial",
      fontSize: 16,
      color: "#ff0000",
    }).setOrigin(0.5);

    // 🔐 LOGIN con email
    boton.on("pointerdown", async () => {
      const email = prompt("📧 Email:");
      const password = prompt("🔑 Contraseña:");
      if (!email || !password) return;

      this.firebase
        .signInWithEmail(email, password)
        .then(() => {
          message.setColor("#00b400").setText("✅ Sesión iniciada correctamente");
          setTimeout(() => this.scene.start("MainMenu"), 800);
        })
        .catch((err) => {
          console.log("⚠️ Error Firebase:", err.code);

          const crearUsuario = window.confirm(
            "📭 Email no encontrado.\n¿Desea crear un usuario nuevo?"
          );
          if (crearUsuario) {
            this.firebase
              .createUserWithEmail(email, password)
              .then(() => {
                message.setColor("#00b400").setText("✅ Usuario creado correctamente");
                setTimeout(() => this.scene.start("MainMenu"), 800);
              })
              .catch((createUserError) => {
                console.log("🚨 Error al crear usuario:", createUserError);
                message.setColor("#ff0000").setText("⚠️ No se pudo crear la cuenta");
              });
          } else {
            message.setColor("#999").setText("✉️ Creación cancelada");
          }
        });
    });

    // 🔹 Separador
    this.add.text(cx, cy + 100, "o continuar con", {
      fontFamily: "Arial",
      fontSize: 18,
      color: "#000000ff",
    }).setOrigin(0.5);

    // 🧿 Íconos (GitHub - Invitado - Google)
    const spacing = 100;
    const yIcons = cy + 180;
    const github = this.add.image(cx - spacing, yIcons, "iconGitHub").setDisplaySize(48, 48).setInteractive({ useHandCursor: true });
    const anon = this.add.image(cx, yIcons, "iconAnon").setDisplaySize(52, 52).setInteractive({ useHandCursor: true });
    const google = this.add.image(cx + spacing, yIcons, "iconGoogle").setDisplaySize(46, 46).setInteractive({ useHandCursor: true });

    // ✨ Efecto hover
    [github, anon, google].forEach(icon => {
      icon.on("pointerover", () => this.tweens.add({ targets: icon, scale: 1.15, duration: 150 }));
      icon.on("pointerout", () => this.tweens.add({ targets: icon, scale: 1, duration: 150 }));
    });

    // 🔗 Métodos alternativos
    github.on("pointerdown", async () => {
      try {
        await this.firebase.signInWithGithub();
        this.scene.start("MainMenu");
      } catch {
        message.setText("⚠️ Error con GitHub");
      }
    });

    anon.on("pointerdown", async () => {
      try {
        await this.firebase.signInAnonymously();
        this.scene.start("MainMenu");
      } catch {
        message.setText("⚠️ Error al ingresar como invitado");
      }
    });

    google.on("pointerdown", async () => {
      try {
        await this.firebase.signInWithGoogle();
        this.scene.start("MainMenu");
      } catch {
        message.setText("⚠️ Error con Google");
      }
    });

    // 🩶 Firma
    this.add.text(cx, this.scale.height - 80, "© Red Studio 2025", {
      fontFamily: "Arial",
      fontSize: 20,
      color: "#ff0000ff",
    }).setOrigin(0.5);
  }
}
