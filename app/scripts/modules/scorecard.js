//
// Keep score!
//---------------------------------------------------------
define(function(require) {
  'use strict';

  var Score = app.score = function() {

    //
    // Libs
    //
    var $ = require('jquery'),
        _ = require('underscore');

    //
    // Initial values
    //
    this.amount     = 0;
    this.modifier   = 0;
    this.wrapper    = $('#score');
    this.wrapper.html('0');

    //
    // Incement the score
    //
    this.add = function() {
      this.amount++;
      this.wrapper.html(this.amount);
    };
  };

  return new Score();

});
