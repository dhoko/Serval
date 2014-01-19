var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    express    = require('express'),
    path       = require('path'),
    tinylr     = require('tiny-lr'),
    open       = require("gulp-open"),
    concat     = require("gulp-concat"),
    uncss      = require('gulp-uncss'),
    browserify = require('gulp-browserify'),
    header     = require('gulp-header'),
    fs         = require('fs'),
    es         = require('event-stream'),
    livereload = require('gulp-livereload'),
    server = tinylr();

var readJson = function(file) {
  var src = fs.readFileSync(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    return data;
  });

  return JSON.parse(src);
}

// Default task : Open url, lauch server, livereaload
gulp.task('default',['vendor','templates','scripts','styles'], function() {


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

      gulp.watch([
          "./**/*",
          "!./node_modules/**/*",
          "!./src/vendor/",
          "!./build/**/*",
          "!./GulpFile.js"], function (evt) {
        gutil.log(gutil.colors.cyan(evt.path), 'changed');
        gulp.run('scripts');
        gulp.run('styles');
        gulp.run('templates');
      });
    });

});

gulp.task('styles', function() {
  gulp.src('./src/styles/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./build/styles/'))
    .pipe(livereload(server))
});


gulp.task('templates', function(cb) {
  return es.concat(
    gulp.src('./src/partials/**/*.html')
      .pipe(header('hello'))
      .pipe(concat('templates.html'))
      .pipe(gulp.dest('/tmp')),
    gulp.src([
      './src/layout/header.html',
      './src/layout/body.html',
      '/tmp/templates.html',
      './src/layout/footer.html',
    ])
      .pipe(concat('index.html'))
      .pipe(gulp.dest('./build'))
      .pipe(livereload(server))
  );
});


gulp.task('vendor', function(){

  var bowerDep = './' + readJson('./.bowerrc').directory;

  return es.concat(
    gulp.src([
      bowerDep + '/jquery/jquery.min.js',
      bowerDep + '/lodash/dist/lodash.min.js',
      bowerDep + '/backbone/backbone.min.js',
    ])
      .pipe(concat("vendor.min.js"))
      .pipe(gulp.dest('build/js')),
    gulp.src(bowerDep + '/normalize-css/normalize.css')
      .pipe(gulp.dest('build/styles'))
  );

});

gulp.task('scripts', function(){
  gulp.src([
      './src/js/bootstrap.js',
      './src/js/models/*.js',
      './src/js/collections/*.js',
      './src/js/views/*.js',
      './src/js/routers/*.js',
      './src/js/app.js',
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(livereload(server))
});

// gulp.task('clean', function(){
//   var spawn = require('child_process').spawn
//       path  = require("path");

//   spawn('rm', ['-r', path.resolve('.') + '/build'], {stdio: 'inherit'});
// });


// A test https://npmjs.org/package/gulp-template
