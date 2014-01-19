var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    express    = require('express'),
    path       = require('path'),
    tinylr     = require('tiny-lr'),
    open       = require("gulp-open"),
    concat     = require("gulp-concat"),
    uncss      = require('gulp-uncss'),
    browserify = require('gulp-browserify'),
    fs         = require('fs');


var createServers = function(port, lrport) {
  var lr = tinylr();
  lr.listen(lrport, function() {
    gutil.log('LR Listening on', lrport);
  });

  var app = express();
  app.use(express.static(path.resolve('./build/')));
  app.listen(port, function() {
    gutil.log('Listening on', port);
  });

  return {
    lr: lr,
    app: app
  };
};

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
gulp.task('default', function(){
  var servers = createServers(8080, 35729);

  // Open Google Chrome @ localhost:8080
  gulp.src('./build/index.html')
    .pipe(open("",{
      app:"google-chrome",
      // app:"/usr/lib/chromium/chromium",
      url: "http://localhost:8080/"
   }));

  // Watch changes from CSS/JS/HTML ...
  gulp.watch([
    "./**/*",
    "!./node_modules/**/*",
    "!./src/vendor/",
    "!./build/**/*",
    "!./GulpFile.js"], function(evt) {
    gutil.log(gutil.colors.cyan(evt.path), 'changed');
    gulp.log(path.extname(evt));
    // gulp.run('browserify:dev');
    // gulp.run('partials:dev');
    // gulp.run('styles:dev');
    servers.lr.changed({
      body: {files: [evt.path]}
    });
  });

});

gulp.task('styles:dev', function() {
  gulp.src('./src/styles/*.css')
    .pipe(concat('main.css'))
    .pipe(uncss({
      html : ['./src/index.html','./src/partials/**/*.html']
    }))
    .pipe(gulp.dest('./build/styles/'));
  });
});

gulp.task('partials:dev', function() {
  gulp.src(['./src/index.html','./src/partials/**/*.html'])
    .pipe(gulp.dest('./build'));
  });
});


gulp.task('vendor', function(){

  var bowerDep = './' + readJson('./.bowerrc').directory;

  gulp.src([
    bowerDep + '/jquery/jquery.min.js',
    bowerDep + '/lodash/dist/lodash.min.js',
    bowerDep + '/backbone/backbone.min.js',
  ])
    .pipe(concat("vendor.min.js"))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('browserify:dev', function(){
  gulp.src('./src/js/app.js')
    .pipe(browserify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('clean', function(){
  var spawn = require('child_process').spawn
      path  = require("path");

  spawn('rm', ['-r', path.resolve('.') + '/build'], {stdio: 'inherit'});
});


// A test https://npmjs.org/package/gulp-template
