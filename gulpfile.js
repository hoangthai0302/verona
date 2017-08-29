var gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
var browserSync = require('browser-sync').create();

gulp.task('sass', function () {
  return gulp.src('./assets/sass/main.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

// html compile
gulp.task('html', function () {
  return gulp.src('./index.html')
    .pipe($.swig({
      defaults: {cache: false}
    }))
    .pipe($.plumber())
    .pipe(browserSync.reload({stream: true}));
});

//Compile scripts
// gulp.task('scripts', function() {
//     return gulp.src('app/scripts/**/*.js')
//         .pipe($.plumber())
//         .pipe($.sourcemaps.init())
//         .pipe($.sourcemaps.write('.'))
//         .pipe(gulp.dest('./dist/scripts'))
//         .pipe(browserSync.stream());
// });


// create server
gulp.task('serve', ['sass', 'html'], function () {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: 9001
  });

  gulp.watch("./assets/sass/**/*.scss", ['sass']);
  gulp.watch("./*.html", ['html']);
});


gulp.task('build', ['sass'], function () {

});

gulp.task('default', function () {
  // place code for your default task here
});