//
// Run the game loop
//---------------------------------------------------------
define(function(require) {
  'use strict';

  var GameLoop = app.gameLoop = function() {

    // Get the ball moving. Har har.
    if (app.gamesOn) {

      // Movement keys
      if (app.keysDown['leftKey']) {
        app.paddle.move('left');
      }

      else if (app.keysDown['rightKey']) {
        app.paddle.move('right');
      }

      app.ball.move();
      app.ball.collisions();

    }

    //
    // This is our main "game loop"
    //
    setTimeout(app.gameLoop, app.config.gameSpeed);

  };

  return new GameLoop();

});
