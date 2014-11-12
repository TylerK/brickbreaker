//
// Ball Module
// ––––––––––––––––––––––––––––––––––––––––––––––
define(function (require) {
  "use strict";

  var Ball = app.ball = function() {

    //
    // Libs
    //
    var $ = require('jquery'),
        _ = require('underscore');


    //
    // Initial setup
    //
    this.ball       = $('#ball');
    this.width      = parseInt(this.ball.width(), 10);
    this.velocity   = 1.11;                // initial velocity
    this.dir        = { x: 0,   y: 270 };  // initial x, y direction
    this.position   = { x: 300, y: 400 };  // initial x, y position


    //
    // Adjust the x and y dir object values
    //
    this.bounce = function(dir, modifier) {

      if (dir === 'x') {
        this.dir.x *= -1;
      }

      if (dir === 'y') {
        this.dir.y *= -1;

        if (modifier) {
          this.dir.x += modifier;
        }
      }

    };


    //
    // Get this ball moving! .... I'll be here all week, folks.
    //
    this.move = function() {

      this.position.x += this.dir.x * Math.PI / 180 * this.velocity;
      this.position.y += this.dir.y * Math.PI / 180 * this.velocity;

      this.ball.css({
        left : this.position.x,
        top  : this.position.y
      });
    };


    //
    // Check for collisions as the ball is moving about
    //
    this.checkBrickCollisions = function(x, y) {

      var width  = app.bricks.brick.width,
          height = app.bricks.brick.height;

      for (var obj in grid) {

        if (destroyed.indexOf(grid[obj].id) < 0) {

          if ( x >= grid[obj].x && x <= grid[obj].x + width && y >= grid[obj].y && y <= grid[obj].y + 30) {

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


    //
    // Setup checks for collision as the ball is moving
    //
    this.collisions = function() {

      var ballX = Math.round(this.position.x),
          ballY = Math.round(this.position.y);

      // Side wall collision
      if (ballX <= app.stage.boundary.left + this.width || ballX >= app.stage.boundary.right - this.width) {
        this.bounce('x');
      }

      // Top wall
      else if (ballY <= app.stage.boundary.top + this.width / 2) {
        this.bounce('y');
      }

      // Paddle
      // Todo: I suspect some css is getting in the way of
      //
      else if (ballY >= app.paddle.position.y - this.width - 2 && ballX >= app.paddle.position.x && ballX < app.paddle.position.x + app.paddle.width) {
        this.collide(paddle);
      }

      // Below paddle = game over!
      else if (ballY >= app.paddle.position.y + this.width + 10) {
        app.gamesOn = false;
      }

      // bricks.height = total height of the bricks container
      else if(ballY <= bricks.height) {

        var brickHit = this.checkBrickCollisions(ballX, ballY);

        if(brickHit) {
          this.bounce('y');
          bricks.explode(brickHit);
          ball.collide(brickHit);
          score.add();
        }
      }
    };


    //
    // What to do when a collision is detected
    //
    this.collide = function(elem) {

      if (elem === paddle) {

        var diff = this.ball.position.x - app.paddle.position.x;
        var launchAngle = 0;

        if ( diff < app.paddle.width / 2 - 10) {
          launchAngle = Math.round(Math.toDegrees(diff / 100) * Math.PI) - 90;
        } else if ( diff > paddle.width / 2 + 10) {
          launchAngle = Math.round(Math.toDegrees(diff / 100) * Math.PI);
        }

        this.ball.bounce('y', launchAngle);

      }
    };
  };

  return new Ball();

});
