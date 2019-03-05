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
    this.background = null;
    this.ledge = null;
    this.obstacle = null;

    this.character = null;
    this.characterGender = null;

    this.cursors = null;

    this.gameMusic = null;

    this.score = 0;
    this.level = 1;
    this.scoreText = null;
    this.levelText = null;

    this.speed = 5;
};

BasicGame.Game.prototype = {

    init: function(characterGender)
    {
        this.characterGender = characterGender;
    },

    create: function ()
    {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.enableBody = true;

        this.gameMusic = this.add.audio('gameMusic');
        this.gameMusic.loop = true;
        this.gameMusic.play();

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        this.levelText = this.add.text(this.world.width - 150, 16, 'Level: 1', { fontSize: '32px', fill: '#FFF' });

        this.ledge = this.game.add.sprite(0, this.world.centerY + 110, 'preloaderBar');
        this.ledge.enableBody = true;
        this.ledge.body.immovable = true;

        this.background = this.game.add.tileSprite(0, this.world.centerY - 150, 800, 350, 'background');

        this.character = this.game.add.sprite(0, this.world.centerY - 50, this.characterGender);
        this.game.physics.arcade.enable(this.character);

        this.character.body.gravity.y = 600;
        this.character.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);

        this.createObstacle();

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function ()
    {
        var hitGround = this.game.physics.arcade.collide(this.character, this.ledge);
        this.background.tilePosition.x -= this.speed;
        this.obstacle.position.x -= this.speed;
        this.character.animations.play('move');

        if (this.cursors.up.isDown && this.character.body.touching.down && hitGround)
            this.character.body.velocity.y = -325;

        if(!this.character.body.touching.down)
        {
            this.character.animations.stop();
            this.character.frame = 2;
        }

        if(this.obstacle.position.x < 0)
        {
            this.scoreText.text = 'Score: ' + ++this.score;

            if (this.score % 5 == 0)
            {
                this.speed++;
                this.levelText.text = "Level: " + ++this.level;
            }

            this.obstacle.kill();
            this.createObstacle();
        }

        this.game.physics.arcade.overlap(this.character, this.obstacle, this.quitGame, null, this);
    },

    createObstacle: function()
    {
        this.obstacle = this.game.add.sprite(this.world.randomX + 400, this.world.centerY + 50, 'fail');
        this.obstacle.body.width = 30; this.obstacle.body.height = 30; //smaller hit boxes
        this.obstacle.enableBody = true;
    },

    quitGame: function ()
    {
        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        this.gameMusic.stop();
        this.score = 0;
        this.speed = 5;
        this.level = 1;

        //  Then let's go back to the main menu.
        this.state.start('PostGame', true, false, this.characterGender);
    }
};
