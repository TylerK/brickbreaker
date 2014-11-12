//
// Run the game loop
//---------------------------------------------------------
define(function(require) {
  'use strict';

  var paddle      = require('modules/paddle'),
      ball        = require('modules/ball'),
      bricks      = require('modules/bricks'),
      controls    = require('modules/controls'),
      score       = require('modules/score');

  var GameLoop = function() {

    // Get the ball moving. Har har.
    if (app.gamesOn) {

      // Movement keys
      if (app.keysDown[app.leftKey]) {
        app.paddle.move('left');
      }

      else if (app.keysDown[app.rightKey]) {
        app.paddle.move('right');
      }

      app.ball.move();
      app.ball.collisionChecker();

    }

    window.requestAnimationFrame(app.gameLoop);

  };

  // Start the game on level 1
  app.bricks.level(app.config.startLevel);
  app.gameLoop = GameLoop;

});
