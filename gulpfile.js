const autoprefixer  = require('gulp-autoprefixer');
const babel         = require('gulp-babel');
const cleanCSS      = require('gulp-clean-css');
const concat        = require('gulp-concat');
const del           = require('del');
const eslint        = require('gulp-eslint');
const gulp          = require('gulp');
const jasmine       = require('gulp-jasmine');
const minifyHTML    = require('gulp-minify-html');
const nodemon       = require('gulp-nodemon');
const paths         = require('./gulp.config.json');
const sass          = require('gulp-sass');
const templateCache = require('gulp-angular-templatecache');
const uglify        = require('gulp-uglify');

gulp.task('test', test);
gulp.task('lint', lint);
gulp.task('clean', clean);
gulp.task('index', index);
gulp.task('scss', scss);
gulp.task('templates', templates);
gulp.task('js', js);
gulp.task('dev', dev);

//////////////////////////////////////////////////

function test() {
  return gulp.
    src(paths.specs).
    pipe(jasmine());
}

function lint() {
  return gulp.
    src(paths.scripts).
    pipe(eslint()).
    pipe(eslint.format()).
    pipe(eslint.failAfterError());
}

function clean() {
  return del(paths.bin);
}

function index() {
  return gulp.
    src(paths.index).
    pipe(minifyHTML({
      empty: true
    })).
    pipe(gulp.dest(paths.bin));
}

function templates() {
  return gulp.
    src(paths.templates).
    pipe(templateCache({
      root: '/',
      module: 'app'
    })).
    pipe(gulp.dest(paths.client));
}

function scss() {
  return gulp.
    src(paths.scss).
    pipe(sass().on('error', sass.logError)).
    pipe(concat('styles.min.css')).
    pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })).
    pipe(cleanCSS()).
    pipe(gulp.dest(paths.bin));
}

function js() {
  return gulp.
    src(paths.js).
    pipe(concat('app.min.js')).
    pipe(babel({
      presets: ['es2015']
    })).
    pipe(uglify()).
    pipe(gulp.dest(paths.bin));
}

function dev() {
  const stream = nodemon({
    script: paths.app,
    ext: 'js'
  });

  stream.
    on('restart', gulp.parallel('lint', 'test')).
    on('crash', function() {
      console.log('Server crashed');
      stream.emit('restart', 10);
    });

  return stream;
}
