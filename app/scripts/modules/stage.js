//
// Main 'stage' object
//---------------------------------------------------------
define(function(require) {
  'use strict';

  var Stage = app.stage = function() {

    this.wrapper    = $('#stage');
    this.width      = parseInt(this.wrapper.width(), 10);
    this.height     = parseInt(this.wrapper.height(), 10);
    this.boundary   = { top: 0, right: this.width, bottom: this.height, left: 0 };

  }

  return new Stage();

});
