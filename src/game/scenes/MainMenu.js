import Phaser from "phaser";
import { DE, EN, ES, PT } from "../../enums/languages";
import { FETCHED, FETCHING, READY, TODO } from "../../enums/status";
import { getTranslations, getPhrase } from "../../services/translations";
import keys from "../../enums/keys";
import GlitchPostFx from "../../lib/GlitchPostFx.js";

export default class MainMenu extends Phaser.Scene {

	constructor() {
		super("MainMenu");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// logo
		this.add.image(475, 334, "logo");

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	create() {
		this.editorCreate();

		// === Selector de idioma con banderas ===
		const flags = [
			{ key: "flag_es", lang: "es" },
			{ key: "flag_en", lang: "en" },
			{ key: "flag_pt", lang: "pt" }
		];

		let x = 200;
		const icons = [];

		flags.forEach((flag) => {
			const icon = this.add.image(x, 80, flag.key)
				.setScale(0.4)
				.setInteractive({ useHandCursor: true })
				.on("pointerdown", () => {
					getTranslations(flag.lang, () => this.scene.restart());
				});

			icon.on("pointerover", () => {
				icon.setScale(0.45);
				icon.setTint(0xffd54f);
			});

			icon.on("pointerout", () => {
				icon.setScale(0.4);
				icon.clearTint();
			});

			x += 100;
			icons.push(icon);
		});

		// Botón 'Jugar'
		const playButton = this.add.text(475, 550, getPhrase('Jugar'), {
			fontFamily: 'Arial Black',
			fontSize: 48,
			color: '#ffffff',
			backgroundColor: '#ff9800',
			align: 'center',
			padding: { left: 20, right: 20, top: 0, bottom: 10 },
			stroke: '#000000',
			strokeThickness: 6
		})
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });

		playButton.on('pointerover', () => playButton.setStyle({ backgroundColor: '#e65100' }));
		playButton.on('pointerout', () => playButton.setStyle({ backgroundColor: '#ff9800' }));
		playButton.on('pointerdown', () => this.scene.start('Game'));

		// === Aplicar glitch shader a toda la cámara ===
		if (this.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
			// Registrar el pipeline correctamente (PostFX)
			if (!this.renderer.pipelines.has('GlitchPostFx')) {
				this.renderer.pipelines.addPostPipeline('GlitchPostFx', GlitchPostFx);
			}

			// Aplicarlo a la cámara principal
			this.cameras.main.setPostPipeline('GlitchPostFx');
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
