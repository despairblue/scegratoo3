'use strict'

/*eslint-env node */

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
var del            = require('del')
var deploy         = require('gulp-gh-pages')
var GH_TOKEN       = process.env.GH_TOKEN
var debug          = require('gulp-debug')

gulp.task('deploy', ['process:html', 'process:bower:css', 'process:bower:rest', 'process:api'], function() {
  return gulp.src('./dist/**/*')
    .pipe(deploy())
})

gulp.task('deploy-travis', ['process:html', 'process:bower:css', 'process:bower:rest', 'process:api'], function() {
  return gulp.src('./dist/**/*')
    .pipe(deploy({
      remoteUrl: 'https://' + GH_TOKEN + '@github.com/despairblue/scegratoo3.git',
    }))
})

gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['dist'], cb)
})

gulp.task('default', [
  'process:html',
  'process:bower:css',
  'process:bower:fonts',
  'process:bower:rest',
  'process:api',
  'watch'
])

gulp.task('process:styles', function() {
  return sass('app/styles/', {
      style:     'expanded',
      loadPath:  'app/bower_components',
      debugInfo: true
    })
    .on('error', function(error) {
      console.error('Error!', error.message)
    })
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
})

gulp.task('process:html', ['process:styles'], function() {
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
    // .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
})

gulp.task('process:bower:js', function() {
  return gulp.src(mainBowerFiles({
      filter: /.*\.js/
    }))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/scripts'))
})

gulp.task('process:bower:css', function() {
  return gulp.src(mainBowerFiles({
    filter: /.*\.css/
  }))
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('dist/styles'))
})

gulp.task('process:bower:rest', function() {
  return gulp.src(mainBowerFiles({
    filter: /.*\.(?!js|css)/
  }))
  // .pipe(debug())
  .pipe(gulp.dest('dist'))
})

gulp.task('process:bower:fonts', function() {
  return gulp.src(mainBowerFiles({
    filter: /.*\.(woff|eot|svg|ttf)/
  }))
  // .pipe(debug())
  .pipe(gulp.dest('dist/fonts'))
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
  })

  // TODO: refactor this gulp file
  // * get rid of usemin
  // * run tests from gulp
  // * don't minify and all that shit
  gulp.watch('app/api/**/*', ['process:api', browserSync.reload])
  gulp.watch('app/scripts/**/*.js', ['process:scripts', browserSync.reload])
  gulp.watch('app/bower_components/**/*', ['process:bower', browserSync.reload])
  gulp.watch('app/styles/**/*.scss', ['process:styles', browserSync.reload])
  gulp.watch('app/**/*.html', ['process:html', browserSync.reload])
})
