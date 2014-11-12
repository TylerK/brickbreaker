'use strict';




// Getting jshint to be quiet about libs.
var $ = $, console = console;




//
// Globals
// ––––––––––––––––––––––––––––––––––––––––––––––
var
  leftKey         = 37, // Keycode
  rightKey        = 39, // Keycode
  gamesOn         = true, // Todo: Tie this to a start button
  keysDown        = {},
  grid            = {},
  destroyed       = [],
  debug           = false
  ;




//
// Utility functions
// ––––––––––––––––––––––––––––––––––––––––––––––
Math.toDegrees = function(rad) {
  return rad * 180 / Math.PI;
};




//
// Stage Object
// ––––––––––––––––––––––––––––––––––––––––––––––
function Stage() {

  this.wrapper    = $('#stage');
  this.width      = parseInt(this.wrapper.width(), 10);
  this.height     = parseInt(this.wrapper.height(), 10);
  this.boundary   = { top: 0, right: this.width, bottom: this.height, left: 0 };

}




//
// Paddle Object
// ––––––––––––––––––––––––––––––––––––––––––––––
function Paddle() {

  this.paddle     = $('#paddle');
  this.width      = parseInt(this.paddle.width(), 10);
  this.position   = {x: 250, y: 580};
  this.speed      = 8;
  this.margin     = 10;

  this.paddle.css({
    left : this.position.x,
    top  : this.position.y
  });

}

Paddle.prototype.move = function(direction) {

  if (direction === 'left' && this.position.x >= stage.boundary.left + 6) {
    this.position.x -= this.speed;
    this.paddle.css({
      left : this.position.x,
      top  : this.position.y
    });
  }

  else if (direction === 'right' && this.position.x <= stage.boundary.right - this.width) {
    this.position.x += this.speed;
    this.paddle.css({
      left : this.position.x,
      top  : this.position.y
    });
  }

};




//
// Bricks Object
// ––––––––––––––––––––––––––––––––––––––––––––––
function Bricks() {

    this.wrapper    = $('#bricks');
    this.height     = 0;
    this.nodes      = {
                        brick:      '<div class="brick"></div>',
                        explosion:  '<div class="explosion"></div>',
                        bits:       '<div class="bits"></div>'
                    };

    this.brick      = {height: 15, width: 44, margin: 2}; // Not an actual brick object, just the default width\height settings

}

Bricks.prototype.layoutLevel = function(bricks) {

    console.log(bricks);

    var id = 1, y = 0, num = 0;

    // Create brick row and columns objects
    for (var i = 0; i < bricks.length; i++) {

        for (var n = 0; n < bricks[i].length; n++) {

            num++;

            // Column objects, then filling the rows with columns
            grid[num] = {
                id: id++,
                x: n * (this.brick.width + 2),
                y: y,
                color: bricks[i][n]
            };

            $(this.nodes.brick)
                .attr('id', grid[num].id)
                .css('left', grid[num].x)
                .css('top', grid[num].y = y * (this.brick.height + 6))
                .addClass('brick-type-' + grid[num].color)
                .appendTo(this.wrapper);

        }

        y++;
        this.height = y * (this.brick.height + 6);

    }

};

Bricks.prototype.level = function(levelIndex) {

    //
    // Available brick colors:
    // 1: teal    2: green,  3: blue,   4: amethyst,
    // 5: yellow  6: orange, 7: grey,   8: white

    this.wrapper.empty();

    var level = [null];

    level[1] = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
    ];


    level[2] = [
        [4, 6, 5, 2, 3, 4, 6, 4, 3, 2, 5, 6, 4],
        [6, 5, 2, 3, 4, 6, 5, 6, 4, 3, 2, 5, 6],
        [5, 2, 3, 4, 6, 5, 8, 5, 6, 4, 3, 2, 5],
        [2, 3, 4, 6, 5, 8, 8, 8, 5, 6, 4, 3, 2],
        [5, 2, 3, 4, 6, 5, 8, 5, 6, 4, 3, 2, 5],
        [6, 5, 2, 3, 4, 6, 5, 6, 4, 3, 2, 5, 6],
        [4, 6, 5, 2, 3, 4, 6, 4, 3, 2, 5, 6, 4],
    ];

    this.layoutLevel(level[levelIndex]);

};

Bricks.prototype.explode = function(brick) {

    var confettiAmount      = 30,
        explosion           = $(this.nodes.explosion),
        bits                = this.nodes.bits,
        explodedBrick       = $('#' + brick.id),
        explosionColor      = explodedBrick.css('background-color');


    // Remove that brick!
    explodedBrick.remove();

    // Drop the explosion on to the dom
    explosion
        .attr('id', 'explosion-' + brick.id)
        .css({
            top             : brick.y,
            left            : brick.x,
            'margin-top'    : '-50px',
            'margin-left'   : '-50px'
        })
        .appendTo(this.wrapper);

    // Drop the exploding bits in to the wrapper
    for (var n = 0; n < confettiAmount; n++ ) {
        explosion.append(bits);
    }

    explosion.find('.bits').each(function() {

        $(this).css({
            background : explosionColor
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
    this.amount     = 0;
    this.modifier   = 0;
    this.wrapper    = $('#score');
    this.wrapper.html('0');
}

Score.prototype.add = function() {
    this.amount++;
    this.wrapper.html(this.amount);
};




//
// Testing stuff
// ––––––––––––––––––––––––––––––––––––––––––––––
function DebugMode() {

    this.nodes = {
        body    : $('body'),
        wrapper : '<div class="debug"></div>',
        hline   : '<div class="hline"></div>',
        vline   : '<div class="vline"></div>'
    };
    this.lines = {};

}

DebugMode.prototype.drawLines = function(elem) {

    console.log(elem);

};

DebugMode.prototype.on = function() {

    debug = true;
    debug.drawLines(paddle.wrapper);
    debug.drawLines(ball.wrapper);

};


DebugMode.prototype.draw = function() {

};




//
// Class instantiations
// ––––––––––––––––––––––––––––––––––––––––––––––
var stage     = new Stage();
var paddle    = new Paddle();
var bricks    = new Bricks();
var ball      = new Ball();
var score     = new Score();
var controls  = new Controls();
var debug     = new DebugMode();




//
// The game loop
// ––––––––––––––––––––––––––––––––––––––––––––––
function gameLoop() {

    // Get the ball moving. Har har.
    if (gamesOn) {

        // Movement keys
        if (keysDown[leftKey]) {
            paddle.move('left');
        }
        else if (keysDown[rightKey]) {
            paddle.move('right');
        }

        ball.move();
        ball.collisions();
    }

    if(debug) {
        debug.draw();
    }

    setTimeout(gameLoop, 20);

}









//
// Game init
// ––––––––––––––––––––––––––––––––––––––––––––––
bricks.level(1);
gameLoop();



