var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cache');
var delFiles = require('del');
var runSequence = require('run-sequence');

// compiling Sass to CSS
gulp.task('sass', function() {
  return gulp.src('app/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// watcher to refresh browser or Sass to CSS compliations on file save
gulp.task('watch', ['browserSync', 'sass'], function() {  
  gulp.watch('app/scss/*.scss', ['sass']);
});

// task to refresh/sync browser
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  });
});

// task to optimize images to interlaced
gulp.task('images', function() {
  return gulp.src('app/images/*.png')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

// task to copy fonts to dist folder
gulp.task('fonts', function() {
  return gulp.src('app/fonts/*')
  .pipe(gulp.dest('dist/fonts'))
});

// task to delete dist folder
gulp.task('clean:dist', function() {
  return delFiles.sync('dist');
});

// task to run all tasks in a sequence so won't fail on build
gulp.task('build', function(callback) {
    runSequence('clean:dist', ['sass', 'images', 'fonts'], 
    callback
  )
});

gulp.task('default', function(callback) {
    runSequence(['sass', 'browserSync', 'watch'], 
    callback
  )
});


