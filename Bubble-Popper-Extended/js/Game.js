"use strict";

BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    /*
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    
    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    */
    
    // For optional clarity, you can initialize
    // member variables here. Otherwise, you will do it in create().
    this.platforms = null;
    this.player = null;
    this.bubbles = null;
    this.bubble = null;
    this.popSound = null;
    this.cursors = null;

    this.score = 0;
    this.lives = 3;
    this.scoreText = null;
    this.livesText = null;
    this.levelText = null;
};

BasicGame.Game.prototype = {

    create: function ()
    {
        this.popSound = this.game.add.audio('pop');

        //All of this code was taken from https://github.com/photonstorm/phaser-ce/tree/master/resources/tutorials/02%20Making%20your%20first%20game
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.add.sprite(0, 0, 'sky');

        this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.livesText = this.game.add.text(this.game.world.width - 128, 16, 'Lives: 3', { fontSize: '32px', fill: '#000' });
        this.levelText = this.game.add.text(this.world.centerX - 50, 16, 'Level 1', { fontSize: '32px', fill: '#000' });

        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        var ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        var ledge = this.platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = this.platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
        this.game.physics.arcade.enable(this.player);

        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldbounds = true;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        //All this code was taken from https://github.com/photonstorm/phaser-examples/blob/master/examples/tweens/bubbles.js
        this.bubbles = this.game.add.group();
        this.bubbles.enableBody = true;
        this.createBubble();
    },

    update: function ()
    {
        this.bubble.body.velocity.y -= 0.9;

        //All of this was taken from https://github.com/photonstorm/phaser-ce/tree/master/resources/tutorials/02%20Making%20your%20first%20game
        var hitPlatform = this.game.physics.arcade.collide(this.player, this.platforms);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        }
        else {
            this.player.animations.stop();
            this.player.frame = 4;
        }

        if (this.cursors.up.isDown && this.player.body.touching.down && hitPlatform)
            this.player.body.velocity.y = -350;

        this.game.physics.arcade.overlap(this.player, this.bubble, this.popBubble, null, this);

        this.loseLife(this.bubble);
    },

    createBubble: function()
    {
        this.bubble = this.bubbles.create(this.game.world.randomX, this.game.world.height, 'bubble')
        this.bubble.scale.set(this.game.rnd.realInRange(0.1, 0.6));
    },

    popBubble: function(player, oldBubble)
    {
        this.popSound.play();

        oldBubble.kill();
        this.score += 10;

        if (this.score == 50)
            this.state.start('GameTwo');
        else
        {
            this.scoreText.text = 'Score: ' + this.score;
            this.createBubble();
        }
    },

    loseLife: function(oldBubble)
    {
        if (this.lives == 0)
            this.quitGame();

        if (oldBubble.bottom <= 0)
        {
            oldBubble.kill;

            this.lives--;
            this.livesText.text = 'Lives: ' + this.lives;

            if (this.lives != 0)
                this.createBubble()
        }
    },

    quitGame: function ()
    {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        this.score = 0;
        this.lives = 4;

        //  Then let's go back to the main menu.
        this.state.start('End');

    }

};
