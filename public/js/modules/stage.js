//
// Main 'stage' object
//---------------------------------------------------------
define(function(require) {
  'use strict';

  var $ = require('jquery');

  var Stage = app.stage = function() {

    this.$el      = $('#stage');
    this.width    = parseInt(this.$el.width(), 10);
    this.height   = parseInt(this.$el.height(), 10);
    this.boundary = { top: 0, right: this.width, bottom: this.height, left: 0 };

  };

  app.stage = new Stage();

});
