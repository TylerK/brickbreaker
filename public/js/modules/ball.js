//
// Ball Module
// ––––––––––––––––––––––––––––––––––––––––––––––
define(function (require) {
  "use strict";


  // Libs and othe required modules
  var $     = require('jquery'),
      stage = require('modules/stage');



  // Ball object
  var Ball = function() {

    //
    // Initial setup
    //
    this.$el        = $('#ball');
    this.width      = parseInt(this.$el.width(), 10);
    this.velocity   = 1.11;                // initial velocity
    this.dir        = { x: 0,   y: 270 };  // initial x, y direction
    this.position   = { x: 300, y: 400 };  // initial x, y position


    //
    // Adjust the x and y dir object values when the ball is bounced
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

      this.$el.css({
        left : this.position.x,
        top  : this.position.y
      });
    };


    //
    // Check for a collision, returns true\false
    // This function is part of the gameLoop
    //
    this.collidedWithBrick = function(x, y) {

      var width  = app.bricks.brick.width,
          height = app.bricks.brick.height;

      for (var obj in app.grid) {

        // Making sure the collision is not with an already destroyed brick
        // Avoids race conditions and other uglyness.
        if (app.destroyed.indexOf(app.grid[obj].id) < 0) {

          if (x >= app.grid[obj].x &&
              x <= app.grid[obj].x + width &&
              y >= app.grid[obj].y && y <=
              app.grid[obj].y + 30) {

            var brick = app.grid[obj];
            app.destroyed.push(brick);
            delete app.grid[obj];
            return brick;

          }
        } else {
          return false;
        }
      }
    };


    //
    // Main collisions and boundry checking functionality as the ball is moving
    //
    this.collisionChecker = function() {

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
      // TODO: Since I have to set a bunch of arbitrary pixel amounts
      // here, I suspect there is a CSS fix for this. Need to investigate.
      else if (ballY >= app.paddle.position.y - this.width - 2 && ballX >= app.paddle.position.x && ballX < app.paddle.position.x + app.paddle.width) {
        this.collisionHandler('paddle');
      }

      // Below paddle = game over!
      else if (ballY >= app.paddle.position.y + this.width + 10) {
        app.gamesOn = false;
      }

      // bricks.height = total height of the bricks container
      else if(ballY <= app.bricks.height) {

        var brickHit = this.collidedWithBrick(ballX, ballY);

        if(brickHit) {
          this.bounce('y');
          app.bricks.explode(brickHit);
          this.collisionHandler(brickHit);
          app.score.add();
        }
      }
    };


    //
    // What to do when a collision is detected with the paddle
    //
    this.collisionHandler = function(elem) {

      if (elem === 'paddle') {

        var diff = this.position.x - app.paddle.position.x;
        var launchAngle = 0;

        if (diff < app.paddle.width / 2 - 10) {
          launchAngle = Math.round(Math.toDegrees(diff / 100) * Math.PI) - 90;
        } else if (diff > paddle.width / 2 + 10) {
          launchAngle = Math.round(Math.toDegrees(diff / 100) * Math.PI);
        }

        this.bounce('y', launchAngle);

      }
    };
  };

  app.ball = new Ball();

});
