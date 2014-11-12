//
// Require all the modules and get the party started
//---------------------------------------------------------
define(function (require) {

  var initialize = function() {

    var gameLoop = require('modules/gameloop');
    app.gameLoop();

  };

  return {
    initialize: initialize
  };


});
