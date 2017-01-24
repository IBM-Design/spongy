const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const svg2png = require('gulp-svg2png');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const paths = {
  src: {
    dir: './src'
  },
  dist: {
    dir: './dist'
  },
}

// Source paths
paths.src.fonts = path.join(paths.src.dir, 'fonts');
paths.src.html = path.join(paths.src.dir, 'html');
paths.src.imgs = path.join(paths.src.dir, 'imgs');
paths.src.scripts = path.join(paths.src.dir, 'scripts');
paths.src.styles = path.join(paths.src.dir, 'styles');

// Distribution paths
paths.dist.fonts = path.join(paths.dist.dir, 'fonts');
paths.dist.html = path.join(paths.dist.dir, 'html');
paths.dist.imgs = path.join(paths.dist.dir, 'imgs');
paths.dist.scripts = path.join(paths.dist.dir, 'scripts');
paths.dist.styles = path.join(paths.dist.dir, 'styles');

// HTML build task
gulp.task('html', () => {
  return gulp.src(`${paths.src.html}/*.html`)
    .pipe(gulp.dest(paths.dist.html));
});

const iconSizes = [128, 48, 32, 24, 16];

// Icon build task
gulp.task('icons', () => {
  return iconSizes.forEach((size) => {
    gulp.src(`${paths.src.imgs}/icon.svg`)
      .pipe(svg2png({
        height: size,
        width: size
      }))
      .pipe(rename({
        suffix: `_${size}`,
      }))
      .pipe(gulp.dest(paths.dist.imgs));
  })
});

// Manifest build task
gulp.task('manifest', () => {
  return gulp.src('./manifest.json')
    .pipe(gulp.dest(paths.dist.dir));
});

// Manifest build task
gulp.task('fonts', () => {
  return gulp.src(`${paths.src.fonts}/*`)
    .pipe(gulp.dest(paths.dist.fonts));
});

// Javascript build task
gulp.task('scripts', () => {
  return gulp.src(`${paths.src.scripts}/*.js`)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.dist.scripts));
});

// Sass build task
gulp.task('styles', () => {
  return gulp.src(`${paths.src.styles}/*.scss`)
    .pipe(sass())
    .pipe(gulp.dest(paths.dist.styles));
});

gulp.task('build', ['html', 'icons', 'manifest', 'fonts', 'scripts', 'styles']);

gulp.task('default', ['build'], () => {
  gulp.watch(`${paths.src.html}/**/*.html`, ['html']);
  gulp.watch(`${paths.src.imgs}/icon.svg`, ['icons']);
  gulp.watch('./manifest.json', ['manifest']);
  gulp.watch(`${paths.src.fonts}/*`, ['fonts']);
  gulp.watch(`${paths.src.scripts}/**/*.js`, ['scripts']);
  gulp.watch(`${paths.src.styles}/**/*.scss`, ['styles']);
});
