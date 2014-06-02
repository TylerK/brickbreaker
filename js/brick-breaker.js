'use strict';




// Getting jshint to be quiet about libs.
var $ = $, console = console, _ = _;




//
// Global variables and settings
// ––––––––––––––––––––––––––––––––––––––––––––––
var leftKey         = 37, // Keycode
    rightKey        = 39, // Keycode
    gamesOn         = true, // Todo: Tie this to a start button
    keysDown        = {},
    grid            = {},
    destroyed       = [];




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

    console.log(grid);

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
// Ball Object
// ––––––––––––––––––––––––––––––––––––––––––––––
function Ball() {

    this.ball       = $('#ball');
    this.width      = parseInt(this.ball.width(), 10);
    this.velocity   = 1.11;
    this.dir        = {x: 0,  y: 270};  // initial x, y direction
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

    this.position.x += this.dir.x * Math.PI / 180 * this.velocity;
    this.position.y += this.dir.y * Math.PI / 180 * this.velocity;

    // console.log(this.dir.x);

    this.ball.css({
        left : this.position.x,
        top  : this.position.y
    });

};

// Todo: find better names for these
Ball.prototype.checkBrickCollisions = function(x, y) {

    var width = bricks.brick.width, height = bricks.brick.height;

    for (var obj in grid) {

        if (destroyed.indexOf(grid[obj].id) < 0) {

            if ( x >= grid[obj].x && x <= grid[obj].x + width && y >= grid[obj].y && y <= grid[obj].y + height) {

                var brick = grid[obj];
                delete grid[obj];

                destroyed.push(brick);
                return brick;
            }

        } else {
            return false;
        }

    }

};

Ball.prototype.collisions = function(x, y) {

    var ballX = Math.round(x);
    var ballY = Math.round(y);


    // Side wall collision
    if (ballX <= stage.boundary.left + this.width || ballX >= stage.boundary.right - this.width) {
        this.bounce('x');
    }

    // Top wall
    else if (ballY <= stage.boundary.top + this.width / 2) {
        this.bounce('y');
    }

    // Paddle
    // Todo: Figure out why I need so many arbitrary values
    else if (ballY >= paddle.position.y - this.width - 2 && ballX >= paddle.position.x && ballX < paddle.position.x + paddle.width) {
        this.collide(paddle);
    }

    // Below paddle = game over!
    else if (ballY >= paddle.position.y + this.width + 10) {
        console.log('game over');
        gamesOn = false;
    }


    // Did the ball hit a brick?
    else if(ballY <= bricks.height) {

        var brickHit = this.checkBrickCollisions(ballX, ballY);

        if(brickHit) {
            console.log('hit brick: ' + brickHit);
            bricks.explode(brickHit);
            ball.collide(brickHit);
            score.add(score.amount);
            this.bounce('y');
        }
    }

};

Ball.prototype.collide = function(elem) {

    // console.log('collided with:');
    console.log(elem);

    if (elem === paddle) {

        var diff = ball.position.x - paddle.position.x;
        var launchAngle = 0;

        if ( diff < paddle.width / 2 - 10) {
            launchAngle = Math.round(Math.toDegrees(diff / 100) * Math.PI) - 90;
        } else if ( diff > paddle.width / 2 + 10) {
            launchAngle = Math.round(Math.toDegrees(diff / 100) * Math.PI);
        }

        ball.bounce('y', launchAngle);

    }

    else if (elem.hasOwnProperty('id')) {

    }

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
    this.amount = 1;
    this.wrapper = $('#score');
    this.wrapper.html('0');
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
var bricks    = new Bricks();
var ball      = new Ball();
var score     = new Score();
var controls  = new Controls();




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
        ball.collisions(ball.position.x, ball.position.y);
    }

    setTimeout(gameLoop, 20);

}




//
// Game init
// ––––––––––––––––––––––––––––––––––––––––––––––
bricks.level(1);
gameLoop();




//
// Testing stuff
// ––––––––––––––––––––––––––––––––––––––––––––––
$('.brick').on('click', function() {
    bricks.explode(this, this.id);
});

