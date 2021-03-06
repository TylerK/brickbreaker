//
// Requires
//---------------------------------------------------------
var
  express       = require('express'),
  http          = require('http'),
  path          = require('path'),
  favicon       = require('serve-favicon'),
  logger        = require('morgan'),
  cookieParser  = require('cookie-parser'),
  bodyParser    = require('body-parser'),
  app           = express(),
  server        = http.createServer()
  ;


//
// Express setup
//---------------------------------------------------------

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');
app.use(express.static(process.cwd() + '/public'));

// server stuff!
var port = process.env.PORT || 9999;
app.listen(port);
server.on('request', app);

// Everythings going ok!
server.on('listening', onListening);
function onListening () {
  console.log('Express server listening on port %s.', app.get('port'));
};

// Got an error?
server.on('error', onError);
function onError (error) {
  throw error;
};
server.listen(app.get('port'));


// Homepage
app.get('/', function (req, res) {
  res.render('index', {});
});
