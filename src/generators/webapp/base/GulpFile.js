var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    express    = require('express'),
    path       = require('path'),
    tinylr     = require('tiny-lr'),
    open       = require("gulp-open"),
    concat     = require("gulp-concat"),
    fs         = require('fs'),
    es         = require('event-stream'),
    livereload = require('gulp-livereload'),
    includes   = require('gulp-file-include'),
    server = tinylr();

// Open a file and return a JSON
var readJson = function(file) {
  var src = fs.readFileSync(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    return data;
  });
  return JSON.parse(src);
};

// Default task : Open url, lauch server, livereaload
gulp.task('default',['assets','vendor','partials','styles'], function() {

  // Open Google Chrome @ localhost:8080
  gulp.src('./build/index.html')
    .pipe(open("",{
      app:"google-chrome",
      // app:"/usr/lib/chromium/chromium",
      url: "http://localhost:8080/"
   }));

    var app = express();
    app.use(express.static(path.resolve('./build/')));
    app.listen(8080, function() {
      gutil.log('Listening on', 8080);
    });


    // var ext = path.extname(evt.path);
    // gutil.log(gutil.colors.yellow(ext), 'File extension');

    server.listen(35729, function (err) {
      if (err) return console.log(err);

      // Watch them all
      gulp.watch([
          "./**/*",
          "!./node_modules/**/*",
          "!./src/vendor/",
          "!./build/**/*",
          "!./GulpFile.js"], function (evt) {
        gutil.log(gutil.colors.cyan(evt.path), 'changed');
        gulp.run('scripts');
        gulp.run('styles');
        gulp.run('partials');
      });
    });

});

// Build my css
gulp.task('styles', function() {
  gulp.src('./src/styles/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./build/styles/'))
    .pipe(livereload(server));
});

// Build my css
gulp.task('assets', function() {
  gulp.src('./src/assets/**/*')
    .pipe(gulp.dest('./build/assets/'));
});

gulp.task('partials', function() {
    gulp.src('./src/partials/**/*.html')
      .pipe(includes())
      .pipe(gulp.dest('./build'))
      .pipe(livereload(server));
  });


// Build your vendors
gulp.task('vendor', function(){

  var bowerDep = './' + readJson('./.bowerrc').directory;

  return es.concat(
    gulp.src([
      bowerDep + '/kiwapp/kiwapp.min.js',
      bowerDep + '/scratchcard/scratchcard.min.js',
    ])
      .pipe(concat("vendor.min.js"))
      .pipe(gulp.dest('build/js')),
    gulp.src(bowerDep + '/normalize-css/normalize.css')
      .pipe(gulp.dest('build/styles'))
  );

});

// remove build folder
gulp.task('clean', function(){
  var spawn = require('child_process').spawn;
  spawn('rm', ['-r', path.resolve('.') + '/build'], {stdio: 'inherit'});
});
