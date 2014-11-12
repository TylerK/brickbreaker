//
// Attach a game object to the window object
// and setup some global objects and settings
//---------------------------------------------------------
window.app = {
  leftKey:    37,     // Left keycode
  rightKey:   39,     // Right keycode
  gamesOn:    true,   // Todo: Tie this to a start button
  keysDown:   {},     // An object to keep track of what keys are pressed
  grid:       {},     // This will be filled with the grid-o-bricks
  destroyed:  [],     // Keep an array of destroyed bricks
};


//
// Game config
//---------------------------------------------------------
app.config = {
  startLevel:     1,
  gameSpeed:      20,
  paddleSpeed:    9,
  confettiAmount: 30
};


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
// Init the main game file
//---------------------------------------------------------
define(['app'], function(app) {
  app.initialize();
});

