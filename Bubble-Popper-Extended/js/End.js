"use strict";

BasicGame.End = function (game)
{

    this.background = null;
    this.text = null;
};

BasicGame.End.prototype = {

    preload: function () {

    },

    create: function () {
        this.background = this.game.add.sprite(0, 0, 'preloaderBackground');
        this.text = this.game.add.text(this.world.centerX - 175, this.world.centerY, '\t\t\t\t\t\t\tGame Over!\nRefresh to play again!', { fontSize: '32px', fill: '#000' });
    },

    update: function () {

    }
};
