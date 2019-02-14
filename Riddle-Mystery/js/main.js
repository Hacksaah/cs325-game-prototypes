"use strict";

window.onload = function ()
{
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser-examples/tree/master/examples/assets/sprites
    // and https://github.com/photonstorm/phaser-examples/tree/master/examples/assets/tilemaps
    // and http://phaser.io/examples/v2/camera/basic-follow
    // and http://phaser.io/examples/v2/tilemaps/fill-tiles
    // and http://phaser.io/examples/v2/tweens/alpha-text
    // and http://www.orangefreesounds.com/jeopardy-theme-song/
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload()
    {
        // Load our assets
        game.load.tilemap('desert', 'assets/desert.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tmw_desert_spacing.png');

        game.load.spritesheet('pacman', 'assets/pacman.png', 28, 28);
        game.load.spritesheet('metalhead', 'assets/metalface.png', 78, 92);

        game.load.image('npc1', 'assets/beball.png');
        game.load.image('npc2', 'assets/mushroom.png');
        game.load.image('npc3', 'assets/darkwing.png');

        game.load.audio('jeopardy', 'assets/jeopardy.mp3');
    }

    var map, layer;
    var pacman, metalhead;
    var npc1, npc2, npc3;
    var player1ScoreText, player2ScoreText;
    var player1Score, player2Score;
    var music;
    
    function create()
    {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#001255';

        // Create our environment
        // Got this chunk of code from: http://phaser.io/examples/v2/tilemaps/fill-tiles
        map = game.add.tilemap('desert');
        map.addTilesetImage('Desert', 'tiles');
        layer = map.createLayer('Ground');

        // Add score text
        player1ScoreText = game.add.text(16, 16, 'Player 1 Score: 0', { fontSize: '32px', fill: '#000' });
        player2ScoreText = game.add.text(456, 16, 'Player 2 Score: 0', { fontSize: '32px', fill: '#000' });

        // Add the characters
        pacman = game.add.sprite(game.world.centerX, game.world.centerY, 'pacman');
        game.physics.arcade.enable(pacman);
        pacman.anchor.setTo(0.5, 0.5);
        pacman.frame = 5;
        pacman.animations.add('left', [7, 8, 9, 10], 10, true);
        pacman.animations.add('right', [3, 2, 1, 0], 10, true);

        metalhead = game.add.sprite(game.world.centerX - 150, game.world.centerY, 'metalhead');
        game.physics.arcade.enable(metalhead);
        metalhead.anchor.setTo(0.5, 0.5);
        metalhead.animations.add('moving', [0, 1, 2, 3], 10, true);

        // Add NPC's
        npc1 = game.add.sprite(150, 50, 'npc1');
        game.physics.arcade.enable(npc1);
        npc1.body.immovable = true;

        npc2 = game.add.sprite(game.world.width - 150, 50, 'npc2');
        game.physics.arcade.enable(npc2);
        npc2.body.immovable = true;

        npc3 = game.add.sprite(game.world.centerX, game.world.height - 50, 'npc3');
        game.physics.arcade.enable(npc3);
        npc3.body.immovable = true;

        // Add music
        music = game.add.audio('jeopardy');

        //got this line from: http://phaser.io/examples/v2/camera/basic-follow
        game.camera.follow(pacman);
    }
    
    var dx, dy;

    function update()
    {
        game.physics.arcade.overlap(pacman, npc1, collideWithNPC1, null, this);
        game.physics.arcade.overlap(pacman, npc2, collideWithNPC2, null, this);
        game.physics.arcade.overlap(pacman, npc3, collideWithNPC3, null, this);
        
        game.input.onDown.add(movePlayer, this);

        if(pacman.x == dx && pacman.y == dy)
        {
            pacman.animations.stop();
            pacman.frame = 5;

            metalhead.animations.stop();
            metalhead.frame = 0;
        }
    }

    function collideWithNPC1(pacman, npc1)
    {
        riddle1()
        npc1.kill();
    }

    function collideWithNPC2(pacman, npc2)
    {
        riddle2();
        npc2.kill();
    }

    function collideWithNPC3(pacman, npc3)
    {
        riddle3();
        npc3.kill();
    }

    function movePlayer(pointer)
    {
        dx = pointer.x;
        dy = pointer.y;

        game.add.tween(pacman).to({ x: dx, y: dy }, 2000, Phaser.Easing.Linear.None, true);

        if (dx > pacman.body.x)
            pacman.animations.play('right');
        else
            pacman.animations.play('left');

        game.add.tween(metalhead).to({ x: dx - 150, y: dy }, 2000, Phaser.Easing.Linear.None, true);
        metalhead.animations.play('moving');
    }

    function riddle1()
    {
        var riddle1Text = game.add.text(game.world.centerX - 300, game.world.centerY - 100, 'What has four fingers and a thumb, \n \t\t\t\t\t\t\t\t\t\t\t\t but is not living?',
                                    { fontSize: '32px', fill: '#FFF' });

        //got this line from: http://phaser.io/examples/v2/tweens/alpha-text
        game.add.tween(riddle1Text).to({ alpha: 0 }, 15000, "Linear", true);

        music.volume = 1;
        game.add.tween(music.play()).to({ volume: 0 }, 15000, "Linear", true);
    }

    function riddle2()
    {
        var riddle2Text = game.add.text(game.world.centerX - 250, game.world.centerY - 100, 'What gets wet when drying?', { fontSize: '32px', fill: '#FFF' });
        game.add.tween(riddle2Text).to({ alpha: 0 }, 15000, "Linear", true);

        music.volume = 1;
        game.add.tween(music.play()).to({ volume: 0 }, 15000, "Linear", true);
    }

    function riddle3()
    {
        var riddle3Text = game.add.text(game.world.centerX - 300, game.world.centerY - 100, 'What starts with an e, ends with an e, \n\t\t and has one letter inbetween it?', { fontSize: '32px', fill: '#FFF' });
        game.add.tween(riddle3Text).to({ alpha: 0 }, 15000, "Linear", true);

        music.volume = 1;
        game.add.tween(music.play()).to({ volume: 0 }, 15000, "Linear", true);
    }
};
