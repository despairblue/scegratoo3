'use strict';

var gulp           = require('gulp')
var sass           = require('gulp-ruby-sass')
var autoprefixer   = require('gulp-autoprefixer')
var minifycss      = require('gulp-minify-css')
var rename         = require('gulp-rename')
var concat         = require('gulp-concat')
var uglify         = require('gulp-uglify')
var changed        = require('gulp-changed')
var usemin         = require('gulp-usemin')
var browserSync    = require('browser-sync')
var mainBowerFiles = require('main-bower-files')
var del            = require('del');

gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['dist'], cb);
});

gulp.task('default', [
  'process:styles',
  'process:scripts',
  'process:html',
  'process:bower',
  'process:api',
  'watch'
])

gulp.task('process:styles', function() {
  return gulp.src('app/styles/*.scss')
    .pipe(changed('dist/styles'))
    .pipe(sass({
      style: 'expanded',
      loadPath: 'app/bower_components',
      debugInfo: true
    }))
    .pipe(autoprefixer('last 1 version'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
})

gulp.task('process:html', function() {
  return gulp.src('app/**/*.html')
    .pipe(usemin())
    .pipe(gulp.dest('dist'))
})

gulp.task('process:scripts', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe(changed('dist/scripts'))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
})

gulp.task('process:bower', function() {
  return gulp.src(mainBowerFiles({
      filter: /.*\.js/
    }))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/scripts'))
})

gulp.task('process:bower', function() {
  return gulp.src(mainBowerFiles({
    filter: /.*\.css/
  }))
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('dist/styles'))
})

gulp.task('process:bower', function() {
  return gulp.src(mainBowerFiles({
    filter: /.*\.(?!js|css)/
  }))
  .pipe(gulp.dest('dist'))
})

gulp.task('process:api', function() {
  return gulp.src('app/api/**/*')
    .pipe(gulp.dest('dist/api'))
})

gulp.task('watch', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch('app/scripts/**/*.js', ['process:scripts', browserSync.reload])
  gulp.watch('app/bower_components/**/*.js', ['process:bower', browserSync.reload])
  gulp.watch('app/styles/**/*.scss', ['process:styles', browserSync.reload])
  gulp.watch('app/**/*.html', ['process:html', browserSync.reload])
})