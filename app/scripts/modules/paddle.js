//
// Paddle object
//---------------------------------------------------------
define(function(require) {
  'use strict';

  var Paddle = function() {

    var $ = require('jquery');

    //
    // Initial settings
    //
    this.$el        = $('#paddle');
    this.width      = parseInt(this.$el.width(), 10);
    this.position   = {x: 250, y: 580};
    this.speed      = app.config.paddleSpeed;
    this.margin     = 10;

    this.$el.css({
      left : this.position.x,
      top  : this.position.y
    });

    //
    // Paddle movement function
    //
    this.move = function(direction) {

      if (direction === 'left' && this.position.x >= app.stage.boundary.left + 6) {
        this.position.x -= this.speed;
        this.$el.css({
          left : this.position.x,
          top  : this.position.y
        });
      }

      else if (direction === 'right' && this.position.x <= app.stage.boundary.right - this.width - 8) {
        this.position.x += this.speed;
        this.$el.css({
          left : this.position.x,
          top  : this.position.y
        });
      }

    };
  };

  app.paddle = new Paddle();

});
