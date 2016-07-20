var gulp = require('gulp')
var lib = require('./gulp')
var config = require('./gulp/config.js')

// Function compile recive 5 parametros
// watch, pug, sass, js, Entry point

gulp.task('pug', function () {
  lib.compile(false, true, false, config.pug.src)
})

gulp.task('styles', function () {
  lib.compile(false, false, true, config.styles.src)
})

gulp.task('build', function () {
  lib.compileJS(false)
})

gulp.task('pug:watch', function () {
  lib.compile(true, true, false, config.pug.src)
})

gulp.task('styles:watch', function () {
  lib.compile(true, false, true, config.styles.src)
})

gulp.task('build:watch', function () {
  lib.compileJS(true)
})

gulp.task('default', ['pug', 'styles', 'build'])
gulp.task('watch', ['pug:watch', 'styles:watch', 'build:watch'])
