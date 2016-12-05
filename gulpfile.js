const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const paths = {
  src: {
    dir: path.join(__dirname, 'src'),
  },
  dist: {
    dir: path.join(__dirname, 'dist')
  },
}

// Source paths
paths.src.html = path.join(paths.src.dir, 'html');
paths.src.imgs = path.join(paths.src.dir, 'imgs');
paths.src.scripts = path.join(paths.src.dir, 'scripts');
paths.src.styles = path.join(paths.src.dir, 'styles');

// Distribution paths
paths.dist.html = path.join(paths.dist.dir, 'html');
paths.dist.imgs = path.join(paths.dist.dir, 'imgs');
paths.dist.scripts = path.join(paths.dist.dir, 'scripts');
paths.dist.styles = path.join(paths.dist.dir, 'styles');

// HTML build task
gulp.task('html', () => {
  return gulp.src(`${paths.src.html}/*.html`)
    .pipe(gulp.dest(paths.dist.html));
});

// Images build task
gulp.task('imgs', () => {
  return gulp.src(`${paths.src.imgs}/*`)
    .pipe(gulp.dest(paths.dist.imgs));
});

// Javascript build task
gulp.task('scripts', () => {
  return gulp.src([`${paths.src.scripts}/*.js`])
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.dist.scripts));
});

// Sass build task
gulp.task('styles', () => {
  return gulp.src(`${paths.src.styles}/main.scss`)
    .pipe(sass())
    .pipe(gulp.dest(paths.dist.styles));
});

gulp.task('default', ['html', 'imgs', 'scripts', 'styles']);

gulp.task('watch', ['default'], () => {
  gulp.watch(`${paths.src.html}/**/*.html`, ['html']);
  gulp.watch(`${paths.src.imgs}/**/*`, ['imgs']);
  gulp.watch(`${paths.src.scripts}/**/*.js`, ['scripts']);
  gulp.watch(`${paths.src.styles}/**/*.scss`, ['styles']);
});
