var gulp = require('gulp')
var pug = require('gulp-pug')
var sass = require('gulp-sass')
var babel = require('babelify')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var watchify = require('watchify')
var rename = require('gulp-rename')
var plumber = require('gulp-plumber')
var gulpWatch = require('gulp-watch')
var cleanCSS = require('gulp-clean-css')
var config = require('./config.js')

function pugJob (bundle) {
  bundle
    .pipe(pug({
      pretty: true,
      compileDebug: true,
      cache: false
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(config.dest))
}

function sassJob (bundle) {
  bundle
    .pipe(plumber())
    .pipe(sass())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('app.css'))
    .pipe(gulp.dest(config.dest))
}

function compileJS (watch) {
  var bundle = browserify(config.js.src, { debug: true })

  if (watch) {
    bundle = watchify(bundle)
    bundle.on('update', function () {
      console.log('--> Bundling...')
      rebundle()
    })
  }

  function rebundle () {
    bundle
      .transform(babel, { presets: [ 'es2015' ] })
      .bundle()
      .on('error', function (err) { console.log(err); this.emit('end') })
      .pipe(source('index.js'))
      .pipe(rename('app.js'))
      .pipe(gulp.dest(config.dest))
  }

  rebundle()
}

function compile (watch, pug, sass, bundleSource) {
  var bundle = gulp.src(bundleSource)

  if (watch && sass) {
    return bundle
      .pipe(gulpWatch(bundleSource, () => {
        bundle = gulp.src(bundleSource)
        sassJob(bundle)
        console.log('Compilando sass...')
      }))
  } else if (sass) {
    sassJob(bundle)
    console.log('Compilando sass..')
  } else if (watch && pug) {
    return bundle.pipe(gulpWatch(bundleSource, () => {
      bundle = gulp.src(bundleSource)
      pugJob(bundle)
      console.log('Compilando pug..')
    }))
  } else if (pug) {
    pugJob(bundle)
    console.log('Compilando pug..')
  }
}

module.exports = {
  compile: compile,
  compileJS: compileJS
}
