var gulp = require('gulp'),
  path = require('path'),
  jshint = require('gulp-jshint'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  runSequence = require('run-sequence'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  pug = require('gulp-pug'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  zip = require('gulp-zip'),
  child = require('child_process'),
  data_html = require('./app/src/data/data.js'),
  browserSync = require('browser-sync').create();


var
  config_dir = './config',
  app_dir = './app',
  src_dir = path.join(app_dir, 'src'),
  assets_dir = path.join(src_dir, 'assets'),
  dist_dir = path.join(app_dir, 'dist'),
  dist_src = path.join(dist_dir, '**');

var
  src_vendor_legacy = path.join(src_dir, 'vendor', '**', '*'),
  src_fonts = path.join(assets_dir, 'fonts', '**'),
  src_js = path.join(src_dir, 'js', '**', '*.js');

var
  src_sass = path.join(src_dir, 'scss', '**', '*.scss'),
  src_assets = path.join(assets_dir, '**'),
  src_html_dir = path.join(src_dir, 'templates'),
  src_html_pages = path.join(src_html_dir, '*.pug'),
  src_html = path.join(src_html_dir, '**', '*.pug');

var
  dist_assets = path.join(dist_dir),
  dist_css = path.join(dist_dir, 'css'),
  dist_js = path.join(dist_dir, 'js'),
  dist_fonts = path.join(dist_dir, 'fonts');

var src_js_rename = 'app.js',
  vendor_js_rename = 'vendor.js',
  vendor_css_rename = 'vendor.css';

var vendor_js_src = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js',
  'node_modules/bootstrap-select/dist/js/bootstrap-select.min.js'
];

var vendor_css_src = [
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'node_modules/bootstrap-select/dist/css/bootstrap-select.min.css'
];


gulp.task('pug', () => {
  return gulp.src(src_html_pages)
    .pipe(pug({
      pretty: true,
      basedir: src_html_dir,
      data: data_html
    }))
    .pipe(gulp.dest(dist_dir));
  browserSync.reload
});


gulp.task('clean', function (cb) {
  return del([dist_dir], cb);
}).help = 'Remove files.';


gulp.task('jshint-dist-fail', function () {
  return gulp
    .src(src_js)
    .pipe(jshint(path.join(config_dir, 'dist.jshintrc')))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
}).help = 'Analyzes js code quality with jshint according dist config file.';


gulp.task('jshint-dist', function () {
  return gulp
    .src(src_js)
    .pipe(jshint(path.join(config_dir, 'dist.jshintrc')))
    .pipe(jshint.reporter('jshint-stylish'));
}).help = 'Analyzes js code quality with jshint according dist config file.';


gulp.task('sass-min', function () {
  return gulp
    .src(src_sass)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      sourceComments: false
    }))
    .pipe(autoprefixer({
      browsers: ['last 3 version', 'ie >= 10']
    }))
    .pipe(gulp.dest(dist_css));
}).help = 'Compiles, minifies and autoprefixes sass desktop source files.';


gulp.task('sass', function () {
  return gulp
    .src(src_sass)
    .pipe(sass({
      errLogToConsole: true,
      sourceComments: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 3 version', 'ie >= 10']
    }))
    .pipe(gulp.dest(dist_css))

  browserSync.reload
}).help = 'Compiles and autoprefixes sass desktop source files.';


gulp.task('vendor', function () {
  gulp.src(vendor_js_src)
    .pipe(concat(vendor_js_rename))
    .pipe(gulp.dest(dist_js));

  return gulp.src(vendor_css_src)
    .pipe(concat(vendor_css_rename))
    .pipe(gulp.dest(dist_css));
}).help = 'Concatenates vendor files.';


gulp.task('vendor-legacy', function () {
  return gulp.src(src_vendor_legacy)
    .pipe(gulp.dest(dist_dir));
}).help = 'Add vendor legacy files.';


gulp.task('scripts-min', function () {
  return gulp
    .src(src_js)
    .pipe(concat(src_js_rename))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify({
      output: {
        max_line_len: 490
      }
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_js));
}).help = 'Concatenates and minifies all js files.';


gulp.task('scripts', function () {
  return gulp
    .src(src_js)
    .pipe(concat(src_js_rename))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_js));
  browserSync.reload
}).help = 'Concatenates all js files.';


gulp.task('fonts', function () {
  return gulp
    .src(src_fonts)
    .pipe(gulp.dest(dist_fonts));
}).help = 'Copy fonts files.';


gulp.task('images', function () {
  return gulp
    .src(src_assets)
    .pipe(gulp.dest(dist_assets));
}).help = 'Copy images files.';


gulp.task('pre-commit', function () {
  return runSequence('pug', 'jshint-dist-fail', 'sass');
});


gulp.task('pre-push', function (cb) {
  return runSequence(['pre-commit'],
    function () {
      var branch = child.execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'UTF-8' }).trim();

      if (branch === 'master' || branch === 'develop') {
        cb('Don\'t push to master or develop!');
      }
    }
  );
});


gulp.task('watch', function () {
  gulp.watch(src_js, ['jshint-dist', 'scripts']).on("change", browserSync.reload);
  gulp.watch(src_sass, ['sass']).on("change", browserSync.reload);
  gulp.watch(src_html, ['pug']).on("change", browserSync.reload);
}).help = 'Keeps watching for changes in sass (trigger sass) and javascript (trigger jshint and scripts).';


gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: dist_dir
    }
  });
});


gulp.task('dist', function () {
  runSequence(
    'clean',
    ['pug', 'vendor-legacy', /*'jshint-dist-fail',*/ 'fonts', 'images', 'vendor', 'sass-min', 'scripts'],
    function () {
      gulp.src(dist_src)
      .pipe(zip('dist.zip'))
      .pipe(gulp.dest('./'))
      .pipe(notify({
        title: 'Dist',
        message: 'Build task done!'
      }));
    }
  );
}).help = 'Builds dist. Executes clean, sass-min, jshint-dist, vendor-scripts and scripts.';


gulp.task('default', function () {
  runSequence(
    'clean',
    ['pug', 'vendor-legacy', 'jshint-dist', 'fonts', 'images', 'vendor', 'sass', 'scripts'], ['watch', 'browser-sync'],
    function () {
      gulp.src('').pipe(notify({
        title: 'Development',
        message: 'Built task done, now watching for changes...'
      }));
    }
  );
}).help = 'Build assets for development. Executes jshint, sass, vendor-scripts and scripts. Keeps watching for changes';
