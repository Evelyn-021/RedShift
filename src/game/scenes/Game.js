
export default class Game extends Phaser.Scene {

	constructor() {
		super("Game");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

    create ()
    {
		this.editorCreate();

        this.cameras.main.setBackgroundColor(0x00ff00);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
