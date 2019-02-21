"use strict";

BasicGame.MainMenu = function (game) {

	this.music = null;
	this.boyButton = null;
	this.girlButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.play();

		this.add.tileSprite(0, 0, 800, 600, 'titlePage');

		this.boyButton = this.add.button(this.world.centerX - 75, this.world.centerY - 100, 'boyButton', this.startBoyGame, this);
		this.girlButton = this.add.button(this.world.centerX - 75, this.world.centerY + 50, 'girlButton', this.startGirlGame, this);

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startBoyGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('Game', true, false, 'boy');
	},

    startGirlGame: function (pointer) {

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        this.music.stop();

        //	And start the actual game
        this.state.start('Game', true, false, 'girl');
    }

};
