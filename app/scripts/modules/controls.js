//
// Controls Object
// ––––––––––––––––––––––––––––––––––––––––––––––
define(function(require) {
  'use strict';

  var $ = require('jquery');

  var Controls = function() {

    // Any pressed key gets dumped in to the keysDown
    // object for use in the game loop.
    $(document).on('keydown', function(e) {
      app.keysDown[e.which] = true;
    });

    $(document).on('keyup', function(e) {
      delete app.keysDown[e.which];
    });

  };

  app.controls = new Controls();

});
