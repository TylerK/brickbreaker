//
// Require all the things!
//---------------------------------------------------------
var

  // Gulp plugins
  gulp    = require('gulp'),
  jade    = require('gulp-jade'),
  jshint  = require('gulp-jshint'),
  notify  = require('gulp-notify'),
  plumber = require('gulp-plumber'),
  server  = require('gulp-express'),
  stylus  = require('gulp-stylus'),
  uglify  = require('gulp-uglify'),
  watch   = require('gulp-watch'),

  // Other misc requires
  nib     = require('nib'),
  path    = require('path'),
  stylish = require('jshint-stylish'),
  sync    = require('browser-sync'),
  reload  = sync.reload

  // RequireJS require
  gulpRequire = require('gulp-requirejs')
;


//
// Base directories
//---------------------------------------------------------
var
  appDir     = path.join(__dirname, '/app'),
  staticDir  = path.join(__dirname, '/public'),
  viewsDir   = path.join(appDir, '/views')
;


//
// Input directories
//---------------------------------------------------------
var input = {
  styles      : path.join(appDir, '/styles'),
  scripts     : path.join(appDir, '/scripts')
};


//
// Input files
//---------------------------------------------------------
var files = {
  stylus      : path.join(input.styles, '/**/*'),
  scripts     : path.join(input.scripts, '/**/*'),
  views       : path.join(viewsDir, '/**/*')
};


//
// Output Directories
//---------------------------------------------------------
var output = {
  styles      : path.join(staticDir, '/css'),
  scripts     : path.join(staticDir, '/js')
};


//
// Stylus task
//---------------------------------------------------------
gulp.task('stylus', function() {
  return gulp.src(files.stylus)
    .pipe(plumber({
      errorHandler: notify.onError({
        sound: 'Purr',
        title: "Stylus Error:",
        message:  "<%= error.message %>"})
    }))
    .pipe(stylus({
      use: [nib()],
      sourcemap: {
        inline: true,
        sourceRoot: '.',
        basePath: output.styles
      },
      compress: false,
      linenos: false
    }))
    .pipe(gulp.dest(output.styles))
    .pipe(reload({ stream: true }));
});


//
// Javascript task
//---------------------------------------------------------
gulp.task('scripts', function() {
  return gulp.src([files.scripts, '!app/scripts/libs/**/*'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(plumber({
      errorHandler: notify.onError({
        sound: 'Purr',
        title: "Javascript Error:",
        message:  "Line: <%= error.lineNumber %> -- <%= error.message %>"})
    }))
    // .pipe(uglify())
    .pipe(gulp.dest(output.scripts))
    .pipe(reload({ stream: true }));
});


//
// Watch tasks
//---------------------------------------------------------
gulp.task('watch', function() {
  gulp.watch(files.stylus, ['stylus']);
  gulp.watch(files.scripts, ['scripts']);
  gulp.watch(files.components, ['react']);
  gulp.watch(files.views, ['jade']);
});


//
// Jade task
//---------------------------------------------------------
gulp.task('jade', function() {
  return gulp.src(files.views)
    .pipe(reload({ stream: true }));
});


//
// Start the Browser Sync server
//---------------------------------------------------------
gulp.task('sync', function() {
  sync({
    brower: null,
    proxy: 'localhost:9999',
    debugInfo: false,
    open: false
  })
});


//
// Run our local express app
//---------------------------------------------------------
gulp.task('server', function() {
  server.run({
    file: 'app.js'
  });
});


//
// The big deal
//---------------------------------------------------------
gulp.task('default', ['stylus', 'scripts', 'server', 'sync', 'watch']);
