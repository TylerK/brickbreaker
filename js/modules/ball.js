//
// Ball Object
// ––––––––––––––––––––––––––––––––––––––––––––––

game.ball = function Ball() {

  this.ball       = $('#ball');
  this.width      = parseInt(this.ball.width(), 10);
  this.velocity   = 1.11;
  this.dir        = { x: 0,   y: 270 };  // initial x, y direction
  this.position   = { x: 300, y: 400 }; // initial x, y position

}

game.Ball.prototype.bounce = function(dir, modifier) {

  // Switch, just in case I want to add more directions in the future
  switch(dir) {

    case 'x':
      this.dir.x *= -1;
      break;

    case 'y':
      this.dir.y *= -1;

      if (modifier) {
        this.dir.x += modifier;
      }

      break;

  }
};

game.Ball.prototype.move = function() {

  this.position.x += this.dir.x * Math.PI / 180 * this.velocity;
  this.position.y += this.dir.y * Math.PI / 180 * this.velocity;

  this.ball.css({
    left : this.position.x,
    top  : this.position.y
  });

};

game.Ball.prototype.checkBrickCollisions = function(x, y) {

  var width = game.bricks.brick.width, height = game.bricks.brick.height;

  for (var obj in grid) {

    if (destroyed.indexOf(grid[obj].id) < 0) {

      if ( x >= grid[obj].x && x <= grid[obj].x + width && y >= grid[obj].y && y <= grid[obj].y + 30) {

        var brick = grid[obj];
        delete grid[obj];

        destroyed.push(brick);
        return brick;
      }

    } else {
      return false;
    }

  }

};

game.Ball.prototype.collisions = function() {

  var ballX = Math.round(this.position.x);
  var ballY = Math.round(this.position.y);


  // Side wall collision
  if (ballX <= game.stage.boundary.left + this.width || ballX >= game.stage.boundary.right - this.width) {
    this.bounce('x');
  }

  // Top wall
  else if (ballY <= game.stage.boundary.top + this.width / 2) {
    this.bounce('y');
  }

  // Paddle
  // Todo: Figure out why I need so many arbitrary values
  else if (ballY >= game.paddle.position.y - this.width - 2
        && ballX >= game.paddle.position.x
        && ballX < game.paddle.position.x + game.paddle.width) {
    this.collide(paddle);
  }

  // Below paddle = game over!
  else if (ballY >= paddle.position.y + this.width + 10) {
    game.gamesOn = false;
  }


  // Did the ball hit a brick?
  else if(ballY <= bricks.height) {

    var brickHit = this.checkBrickCollisions(ballX, ballY);

    if(brickHit) {
      this.bounce('y');
      bricks.explode(brickHit);
      ball.collide(brickHit);
      score.add();
    }
  }

};

Ball.prototype.collide = function(elem) {

  if (elem === paddle) {

    var diff = ball.position.x - paddle.position.x;
    var launchAngle = 0;

    if ( diff < paddle.width / 2 - 10) {
      launchAngle = Math.round(Math.toDegrees(diff / 100) * Math.PI) - 90;
    } else if ( diff > paddle.width / 2 + 10) {
      launchAngle = Math.round(Math.toDegrees(diff / 100) * Math.PI);
    }

    ball.bounce('y', launchAngle);

  }

};
