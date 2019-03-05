"use strict";

BasicGame.PostGame = function (game) {

    this.music = null;

    this.playAgainButton = null;
    this.chooseNewCharacterButton = null;

    this.character = null;

    this.text = null;
};

BasicGame.PostGame.prototype = {

    init: function (character)
    {
        this.character = character;
    },

    create: function ()
    {
		this.music = this.add.audio('titleMusic');
		this.music.play();

		this.add.tileSprite(0, 0, 800, 600, 'titlePage');

		this.text = this.game.add.text(this.world.centerX - 250, 64, 'You have to go to summer school!', { fontSize: '32px', fill: '#FFF' });

		this.playAgainButton = this.add.button(this.world.centerX - 100, this.world.centerY - 50, 'playAgain', this.playAgain, this);
		this.chooseNewCharacterButton = this.add.button(this.world.centerX - 100, this.world.centerY + 100, 'chooseNewCharacter', this.chooseNewCharacter, this);
	},

	update: function ()
	{
		//	Do some nice funky main menu effect here
	},

	playAgain: function (pointer)
	{
		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('Game', true, false, this.character);
	},

	chooseNewCharacter: function (pointer)
	{
        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        this.music.stop();

        //	And start the actual game
        this.state.start('MainMenu');
    }
};
