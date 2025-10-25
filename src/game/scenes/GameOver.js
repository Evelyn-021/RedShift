/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class GameOver extends Phaser.Scene {

	constructor() {
		super("GameOver");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// textgameover
		const textgameover = this.add.text(511, 378, "", {});
		textgameover.setOrigin(0.5, 0.5);
		textgameover.text = "Game Over";
		textgameover.setStyle({ "align": "center", "color": "#ffffff", "fontFamily": "Arial Black", "fontSize": "64px", "stroke": "#000000", "strokeThickness": 8 });

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

    create ()
    {
		this.editorCreate();

        this.cameras.main.setBackgroundColor(0xff0000);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });

    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here