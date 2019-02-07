"use strict";

window.onload = function ()
{
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser-ce/tree/master/resources/tutorials/02%20Making%20your%20first%20game
    // and https://github.com/photonstorm/phaser-examples/tree/master/examples/assets/particles
    // and https://github.com/photonstorm/phaser-examples/blob/master/examples/tweens/bubbles.js
    // and http://soundbible.com/533-Pop-Cork.html
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload()
    {
        //Load in all our assets
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('bubble', 'assets/bubble256.png');

        game.load.audio('pop', 'assets/pop_cork_wav.wav');

        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    }
    
    var platforms;
    var player;
    var bubbles;
    var bubble;
    var popSound;

    var score = 0;
    var lives = 3;
    var scoreText;
    var livesText;
    
    function create()
    {
        popSound = game.add.audio('pop');

        //All of this code was taken from https://github.com/photonstorm/phaser-ce/tree/master/resources/tutorials/02%20Making%20your%20first%20game
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'sky');
	
        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        livesText = game.add.text(game.world.width - 128, 16, 'Lives: 3', { fontSize: '32px', fill: '#000' });
	
        platforms = game.add.group();
        platforms.enableBody = true;
	
        var ground = platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;
	
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
	
        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;
	
        player = game.add.sprite(32, game.world.height - 150, 'dude');
        game.physics.arcade.enable(player);
	
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldbounds = true;
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
	
        //All this code was taken from https://github.com/photonstorm/phaser-examples/blob/master/examples/tweens/bubbles.js
        bubbles = game.add.group();
        bubbles.enableBody = true;
        createBubble();
    }

    var cursors;
    
    function update()
    {
        bubble.body.velocity.y -= 0.9;

        //All of this was taken from https://github.com/photonstorm/phaser-ce/tree/master/resources/tutorials/02%20Making%20your%20first%20game
        var hitPlatform = game.physics.arcade.collide(player, platforms);

        cursors = game.input.keyboard.createCursorKeys();

        player.body.velocity.x = 0;
        if (cursors.left.isDown)
        {
            player.body.velocity.x = -150;
            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 150;
            player.animations.play('right');
        }
        else
        {
            player.animations.stop();
            player.frame = 4;
        }

        if (cursors.up.isDown && player.body.touching.down && hitPlatform)
            player.body.velocity.y = -350;

        game.physics.arcade.overlap(player, bubble, popBubble, null, this);

        loseLife(bubble);
    }

    function createBubble()
    {
        bubble = bubbles.create(game.world.randomX, game.world.height, 'bubble')
        bubble.scale.set(game.rnd.realInRange(0.1, 0.6));
    }

    function popBubble(player, oldBubble)
    {
        popSound.play();

        oldBubble.kill();
        score += 10;
        scoreText.text = 'Score: ' + score;

        createBubble();
    }

    function loseLife(oldBubble)
    {
        if (lives == 0)
        {
            var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
            var text = game.add.text(game.world.centerX, 100, "Game Over.\nRefresh to play again", style);
            text.anchor.setTo(0.5, 0.0);
            return;
        }

        if (oldBubble.bottom <= 0)
        {
            oldBubble.kill;

            lives--;
            livesText.text = 'Lives: ' + lives;

            if (lives != 0)
                createBubble()
        }
    }
};
