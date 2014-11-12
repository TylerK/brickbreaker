//
// Bricks Object
//---------------------------------------------------------
define(function (require) {
  "use strict";

  // Libs
  var $ = require('jquery');

  // Ball object
  var Bricks = function() {

    //
    // Initial setup
    //
    this.$el    = $('#bricks');
    this.height = 0;
    this.brick  = { height: 15, width: 44, margin: 2 }; // Not an actual brick object, just the default width\height settings
    this.nodes = {
      brick:      '<div class="brick"></div>',
      explosion:  '<div class="explosion"></div>',
      bits:       '<div class="bits"></div>'
    };


    //
    // Loop through the provided array of bricks and lay them out on the dom
    //
    this.layoutLevel = function(bricks) {

      var id = 1, y = 0, num = 0;

      // Create brick row and columns objects
      for (var i = 0; i < bricks.length; i++) {
        for (var n = 0; n < bricks[i].length; n++) {

          num++;

          // Column objects, then filling the rows with columns
          app.grid[num] = {
            id: id++,
            x: n * (this.brick.width + 2),
            y: y,
            color: bricks[i][n]
          };

          $(this.nodes.brick)
            .attr('id', app.grid[num].id)
            .css('left', app.grid[num].x)
            .css('top', app.grid[num].y = y * (this.brick.height + 6))
            .addClass('brick-type-' + app.grid[num].color)
            .appendTo(this.$el);
        }
        y++;
        this.height = y * (this.brick.height + 6);
      }
    };

    //
    // Design each of the levels here
    // TODO: Break this out in to it's own file once this gets past like 3 or 4 levels
    //
    this.level = function(index) {

      //
      // Available brick colors:
      // 1: teal    2: green,  3: blue,   4: amethyst,
      // 5: yellow  6: orange, 7: grey,   8: white
      //

      this.$el.empty(); // Kill the bricks between levels

      var level = [null]; // Null just to be double sure this gets wiped

      level[1] = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
      ];

      level[2] = [
        [4, 6, 5, 2, 3, 4, 6, 4, 3, 2, 5, 6, 4],
        [6, 5, 2, 3, 4, 6, 5, 6, 4, 3, 2, 5, 6],
        [5, 2, 3, 4, 6, 5, 8, 5, 6, 4, 3, 2, 5],
        [2, 3, 4, 6, 5, 8, 8, 8, 5, 6, 4, 3, 2],
        [5, 2, 3, 4, 6, 5, 8, 5, 6, 4, 3, 2, 5],
        [6, 5, 2, 3, 4, 6, 5, 6, 4, 3, 2, 5, 6],
        [4, 6, 5, 2, 3, 4, 6, 4, 3, 2, 5, 6, 4],
      ];

      //
      // Send the selected level array to the layoutLevel function
      //
      this.layoutLevel(level[index]);

    };

    this.explode = function(brick) {

      var confetti          = app.config.confettiAmount,
          explosion         = $(this.nodes.explosion),
          bits              = $(this.nodes.bits),
          explodedBrick     = $('#' + brick.id),
          explosionColor    = explodedBrick.css('background-color');


      // Remove that brick!
      explodedBrick.remove();

      // Drop the explosion on to the dom
      explosion.attr('id', 'explosion-' + brick.id)
        .css({
          top             : brick.y,
          left            : brick.x,
          'margin-top'    : '-50px',
          'margin-left'   : '-50px'
        })
        .appendTo(this.$el);

      // Drop the exploding bits in to the wrapper
      for (var n = 0; n < confetti; n++ ) {
        explosion.append(bits);
      }

      explosion.find('.bits').each(function() {

        $(this).css({
          background : explosionColor
        });

        $(this).animate({
          top     : Math.round(Math.random() * 360) - 180,
          left    : Math.round(Math.random() * 360) - 180,
          width   : 1,
          height  : 1,
          opacity : 0
        }, {
          duration: 850,
          easing: 'easeOutQuint'
        });
      });
    };
  };

  app.bricks = new Bricks();

});
