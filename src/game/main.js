import Boot from "./scenes/Boot";
import Preloader from "./scenes/Preloader";
import Registro from "./scenes/Registro";
import MainMenu from "./scenes/MainMenu";
import Game from "./scenes/Game";
import GameOver from "./scenes/GameOver";
import FirebasePlugin from "../plugins/FireBasePlugin.js";

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: "#02a8f8",

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  
  dom: {
    createContainer: true, // 🔥 Permite usar this.add.dom() (inputs HTML en Phaser)
  },

  plugins: {
    global: [
      {
        key: "FirebasePlugin",
        plugin: FirebasePlugin,
        start: true,
        mapping: "firebase"
      }
    ]
  },

  scene: [Boot, Preloader, Registro, MainMenu, Game, GameOver]
};

export default new Phaser.Game(config);
