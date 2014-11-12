//
// Keep score!
//---------------------------------------------------------
define(function(require) {
  'use strict';

  var $ = require('jquery');

  var Score = function() {

    //
    // Initial values
    //
    this.amount     = 0;
    this.modifier   = 0;
    this.$el        = $('#score');
    this.$el.html('0');

    //
    // Increment the score
    //
    this.add = function() {
      this.amount++;
      this.$el.html(this.amount);
    };
  };

  app.score = new Score();

});
