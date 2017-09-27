var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps')

var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var buffer = require('vinyl-buffer');

var sass = require('gulp-sass');
var size = require('gulp-size');
var cleanCss = require('gulp-clean-css');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var neat = require('node-neat');
neat.includePaths

var historyApiFallback = require('connect-history-api-fallback')
var merge = require('utils-merge');

const conf = {
  scriptsPath: './scripts/',
  scssPath: './scss/',
  buildPath: './build/',
  babelifyPresets: {
    presets: ["es2015", "react"]
  },
  sassOptions: {
    errLogToConsole: true,
    includePaths: require('node-neat').includePaths,
    outputStyle: 'expanded',
    style: 'compressed',
    quiet: true
  },
  cleanCssOptions: {
    keepSpecialComments: 0
  }
};


/*
  Styles Task
*/

gulp.task('styles',function() {
  
  // move over fonts
  gulp.src('assets/fonts/**.*')
    .pipe(gulp.dest(conf.buildPath+'fonts'))

  // Compiles CSS
  gulp.src(conf.scssPath+'main.scss')
    .pipe(sass(conf.sassOptions))
    .pipe(autoprefixer())
    .pipe(size())
    .pipe(gulp.dest(conf.buildPath+'css/'))
    .pipe(rename('main.min.css'))
    .pipe(cleanCss(conf.cleanCssOptions))
    .pipe(gulp.dest(conf.buildPath+'css/'))
    .pipe(size())
    .pipe(browserSync.stream())
});

/*
  Images
*/
gulp.task('images',function(){
  gulp.src('assets/images/**')
    .pipe(gulp.dest(conf.buildPath+'images'))
});

/*
  Browser Sync

gulp.task('browser-sync', function() {
    browserSync({
        server : {},
        middleware : [ historyApiFallback() ],
        ghostMode: false
    });
});
*/

gulp.task('watchify', function () {
  var args = merge(watchify.args, { debug: true });
  var bundler = watchify(browserify(conf.scriptsPath+'main.js', args)).transform(babelify, conf.babelifyPresets);
  bundle_js(bundler);

  bundler.on('update', function () {
    gutil.log('Rebundle...');
    bundle_js(bundler);
  })
});


function bundle_js(bundler) {
  return bundler.bundle()
    .on('error', handleErrors)
    .pipe(source(conf.scriptsPath+'main.js'))
    .pipe(buffer())
    .pipe(gulp.dest(conf.buildPath))
    .pipe(rename('main.min.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(conf.buildPath))
    .pipe(reload({stream:true}))
}



function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

//'browser-sync',
gulp.task('default', ['images','styles', 'watchify'], function() {
  gulp.watch(conf.scssPath+'*.scss', ['styles']); // gulp watch for stylus changes
  //gulp.watch(conf.scriptsPath+'*.js', ['watchify']);
});
