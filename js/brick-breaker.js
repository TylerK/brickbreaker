'use strict';

// Get JSHint off my nuts
var $ = $, console = console;


//
// Global variables and settings
// ––––––––––––––––––––––––––––––––––––––––––––––
var leftKey         = 37, // Keycode
    rightKey        = 39, // Keycode
    paddleSpeed     = 10,
    scoreAmount     = 1000,
    gamesOn         = true, // Todo: Tie this to a start button
    keysDown        = {};




//
// Stage Object
// ––––––––––––––––––––––––––––––––––––––––––––––
function Stage() {

    this.wrapper    = $('#stage');
    this.width      = parseInt(this.wrapper.width(), 10);
    this.height     = parseInt(this.wrapper.height(), 10);
    this.boundary   = {top: 0, right: this.width, bottom: this.height, left: 0 };

}




//
// Paddle Object
// ––––––––––––––––––––––––––––––––––––––––––––––
function Paddle() {

    this.paddle     = $('#paddle');
    this.width      = parseInt(this.paddle.width(), 10);
    this.position   = {x: 300, y: 580};

}

Paddle.prototype.move = function(direction) {

    if (direction === 'left' && this.position.x > stage.boundary.left + this.width / 2 + 10) {
        this.position.x -= paddleSpeed;
        this.paddle.css('left',  this.position.x);
    }

    else if (direction === 'right' && this.position.x < stage.boundary.right - this.width / 2 - 10) {
        this.position.x += paddleSpeed;
        this.paddle.css('left',  this.position.x);
    }

};




//
// Ball Object
// ––––––––––––––––––––––––––––––––––––––––––––––
function Ball() {

    this.ball       = $('#ball');
    this.width      = parseInt(this.ball.width(), 10);
    this.velocity   = 1.11;
    this.dir        = {x: 0,  y: 270}; // initial x, y direction
    this.position   = {x: 300, y: 400}; // initial x, y position

}

Ball.prototype.bounce = function(dir, modifier) {

    // Switch, just in case I want to add more directions in the future
    switch(dir) {

        case 'x':
            this.dir.x *= -1;
            break;

        case 'y':
            this.dir.y *= -1;

            if (modifier) {
                this.dir.x += modifier;
            }

            break;

    }
};

Ball.prototype.move = function() {

    this.position.x += Math.round(this.dir.x * Math.PI / 180 * this.velocity);
    this.position.y += Math.round(this.dir.y * Math.PI / 180 * this.velocity);

    this.ball.css({
        left : this.position.x,
        top  : this.position.y
    });

};

Ball.prototype.collisions = function() {

    // Side wall collision
    if (this.position.x <= stage.boundary.left + this.width || this.position.x >= stage.boundary.right - this.width) {
        this.bounce('x');
    }

    // Top wall
    else if (this.position.y <= stage.boundary.top + this.width / 2) {
        this.bounce('y');
    }

    // Paddle
    // Todo: Figure out why I need so many arbitrary values
    else if (this.position.y >= paddle.position.y - 30 && this.position.x >= paddle.position.x - paddle.width / 2 && this.position.x < paddle.position.x + paddle.width) {
        this.collide(paddle);
    }

    // Below paddle = game over!
    else if (this.position.y >= paddle.position.y + this.width + 10) {
        console.log('game over');
        gamesOn = false;
    }

    // console.log('Paddle x: ' + paddle.position.x + ' Ball x: ' + this.position.x);

};

Ball.prototype.collide = function(elem) {

    // console.log('collided with:');
    // console.log(elem);

    if (elem === paddle) {


    }

};




//
// Bricks Object
// ––––––––––––––––––––––––––––––––––––––––––––––
function Bricks() {
    this.wrapper = $('#bricks');
}

Bricks.prototype.newRow = function(row) {
    var node = '<div class="row row-' + row + '"></div>';
    this.wrapper.append(node);
};

Bricks.prototype.addBrick = function(type, row) {
    var node = '<div class="brick brick-type-' + type + '"></div>';
    $('.row-' + row).append(node);
};

Bricks.prototype.layoutLevel = function(bricks) {

    // Add rows and bricks to the dom
    for (var i = 0; i < bricks.length; i++) {

        this.newRow(i);

        for (var n = 0; n < bricks[i].length; n++) {
            this.addBrick(bricks[i][n], i, n);
        }
    }

    // Fill the row with the absolute positioned bricks
    // There's probably a better way to do this...
    $('.row').each(function() {
        $(this).find('.brick').each(function(i) {
            $(this).css('left', i * ($(this).width() + 2)) ;
        });
    });
};

Bricks.prototype.level = function(level) {

    //
    // Available brick colors:
    // 1: teal    2: green,  3: blue,   4: amethyst,
    // 5: yellow  6: orange, 7: grey,   8: white
    //

    this.wrapper.empty();

    switch(level) {

        // Level 1
        case 1:

            var level1 = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
                [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
            ];

            this.layoutLevel(level1);

            break;

        // Level 2
        case 2:

            var level2 = [
                [4, 6, 5, 2, 3, 4, 6, 4, 3, 2, 5, 6, 4],
                [6, 5, 2, 3, 4, 6, 5, 6, 4, 3, 2, 5, 6],
                [5, 2, 3, 4, 6, 5, 8, 5, 6, 4, 3, 2, 5],
                [2, 3, 4, 6, 5, 8, 8, 8, 5, 6, 4, 3, 2],
                [5, 2, 3, 4, 6, 5, 8, 5, 6, 4, 3, 2, 5],
                [6, 5, 2, 3, 4, 6, 5, 6, 4, 3, 2, 5, 6],
                [4, 6, 5, 2, 3, 4, 6, 4, 3, 2, 5, 6, 4],
            ];

            this.layoutLevel(level2);

            break;

    }
};

// Todo: Clean this area up
// Might need to add some logic to make avoid duplicate ID's
Bricks.prototype.explode = function(brick) {

    var thisBrick       = $(brick),
        id              = Math.floor(Math.random() * 1000) + 1000,
        node            = $('<div id="' + id + '" class="confetti"></div>'),
        confettiAmount  = Math.floor(Math.random() * 15) + 20;

    $('body').append(node);

    // Drop in the confetti
    for (var n = 1; n < confettiAmount; n++) {
        $(node).append('<div></div>');
    }

    // Position the confetti wrapper
    $(node).css({
        top  : parseInt(thisBrick.offset().top) - 40,
        left : parseInt(thisBrick.offset().left) - 30
    });

    // Explode out the confetti!
    $(node).find('div').each(function() {

        // var randomColor = Math.floor(Math.random() * 360);

        $(this).css({
            // 'background-color' : 'hsla(' + randomColor + ', 100%, 50%, 1)'
            'background-color' : thisBrick.css('background-color')
        });

        $(this).animate({
            top     : Math.round(Math.random() * 360) - 180,
            left    : Math.round(Math.random() * 360) - 180,
            width   : 1,
            height  : 1,
            opacity : 0
        }, {
            duration: 850,
            easing: 'easeOutQuint'
        });

    });

    // Kill the confetti parent after couple of seconds
    setTimeout(function() {
        $(node).remove();
    }, 2000);

    thisBrick.addClass('explode');

    score.add(scoreAmount);

};



//
// Controls Object
// ––––––––––––––––––––––––––––––––––––––––––––––
function Controls() {

    // Any pressed key gets dumped in to the keysDown
    // object for use in the game loop.
    //
    // This kills that shitty lag for the first
    // half a second when holding a key down.

    $(document).on('keydown', function(e) {
        keysDown[e.which] = true;
    });

    $(document).on('keyup', function(e) {
        delete keysDown[e.which];
    });

}



//
// Scoreboard
// ––––––––––––––––––––––––––––––––––––––––––––––
function Score() {
    this.amount = 0;
    this.wrapper = $('#score');
}

Score.prototype.add = function(amount) {
    this.amount += amount;
    this.wrapper.html(this.amount);
};




//
// Class instantiations
// ––––––––––––––––––––––––––––––––––––––––––––––
var stage     = new Stage();
var paddle    = new Paddle();
var ball      = new Ball();
var bricks    = new Bricks();
var score     = new Score();
var controls  = new Controls();




//
// The game loop
// ––––––––––––––––––––––––––––––––––––––––––––––
function gameLoop() {

    // Movement keys
    if (keysDown[leftKey]) {
        paddle.move('left');
    }

    if (keysDown[rightKey]) {
        paddle.move('right');
    }

    // Get the ball moving. Har har.
    if (gamesOn) {
        ball.move();
        ball.collisions();
    }

    setTimeout(gameLoop, 20);

}




//
// Game init
// ––––––––––––––––––––––––––––––––––––––––––––––
bricks.level(1);
score.add(0);
gameLoop();




//
// Testing stuff
// ––––––––––––––––––––––––––––––––––––––––––––––
$('.brick').on('click', function() {
    bricks.explode(this);
});
