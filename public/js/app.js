//
// Require all the modules and get the party started
//---------------------------------------------------------
define(function (require) {

  var initialize = function() {

    // Require all the modules!
    var
      ball        = require('modules/ball'),
      scoreCard   = require('modules/scoreCard'),
      gameLoop    = require('modules/gameloop')
    ;

    // Start the game on level 1
    app.bricks.level(app.config.startLevel);

  };

  return {
    initialize: initialize
  };


});
