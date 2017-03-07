const gulp = require('gulp');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const jasmine = require('gulp-jasmine');
const paths = require('./gulp.config.json');

gulp.task('lint', lint);
gulp.task('test', test);
gulp.task('dev', dev);

//////////////////////////////////////////////////
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

function test() {
  return gulp.
    src(paths.specs.src).
    pipe(jasmine());
}

function lint() {
  return gulp.
    src(paths.scripts.src).
    pipe(eslint()).
    pipe(eslint.format()).
    pipe(eslint.failAfterError());
}

function dev() {
  const stream = nodemon({
    script: paths.app.src,
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
