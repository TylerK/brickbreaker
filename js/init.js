//
// Attach a game object to the window object
//---------------------------------------------------------
window.game = {}


//
// Paths config
//---------------------------------------------------------
require.config({
  'paths': {
    'jquery'      : 'libs/jquery',
    'underscore'  : 'libs/underscore',
  },
  'shim': {
    'jquery-easing' : {
      'deps': ['jquery']
    }
  }
});


//
// Init the game
//---------------------------------------------------------
require(['game'], function(game) {
  game.initialize();
});

