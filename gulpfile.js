const autoprefixer  = require('gulp-autoprefixer');
const babel         = require('gulp-babel');
const browserSync   = require('browser-sync').create();
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
const Karma         = require('karma').Server;
const path          = require('path');

const build = gulp.series(clean,
  gulp.parallel(index, scss, vendors, gulp.series(templates, js)));
gulp.task('build', build);
gulp.task('testNode', testNode);
gulp.task('testKarma', testKarma);
gulp.task('lint', lint);
gulp.task('clean', clean);
gulp.task('index', index);
gulp.task('scss', scss);
gulp.task('templates', templates);
gulp.task('js', js);
gulp.task('vendors', vendors);
gulp.task('dev', dev);
gulp.task('test', gulp.parallel('lint', 'testNode', 'testKarma'));

gulp.task('default', gulp.series(build, dev));

//////////////////////////////////////////////////

function testNode() {
  return gulp.
    src(paths.specs).
    pipe(jasmine());
}

function testKarma(done) {
  new Karma({
    configFile: path.resolve(paths.karmaConfig),
    singleRun: true
  }, done).start();
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
    pipe(gulp.dest(paths.bin));
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
    src(paths.js.concat([paths.templatesJS, '!' + paths.clientSpecs])).
    pipe(concat('app.min.js')).
    pipe(babel({
      presets: ['es2015']
    })).
    pipe(uglify()).
    pipe(gulp.dest(paths.bin));
}

function vendors() {
  return gulp.
    src(paths.vendors).
    pipe(concat('vendors.min.js')).
    pipe(gulp.dest(paths.bin));
}

function reload(done) {
  browserSync.reload();
  done();
}

function dev() {
  const stream = nodemon({
    script: paths.app,
    ext: 'js',
    watch: [paths.server]
  });

  browserSync.init({
    proxy: `localhost:${process.env.PORT || 3000}`,
    port: 7000,
    ui: {
      port: 7001
    }
  });

  gulp.watch(paths.js.concat([
    paths.templates,
    paths.index,
    paths.scssAll,
  ]), gulp.parallel('lint', gulp.series('build', reload, 'testKarma')));

  stream.
    on('start', gulp.series(reload)).
    on('restart', gulp.parallel('lint', 'testNode')).
    on('crash', function() {
      console.log('Server crashed');
      stream.emit('restart', 10);
    });

  return stream;
}
