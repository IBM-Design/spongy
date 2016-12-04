const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');

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
paths.src.scripts = path.join(paths.src.dir, 'scripts');
paths.src.styles = path.join(paths.src.dir, 'styles');

// Distribution paths
paths.dist.html = path.join(paths.dist.dir, 'html');
paths.dist.scripts = path.join(paths.dist.dir, 'scripts');
paths.dist.styles = path.join(paths.dist.dir, 'styles');

// HTML build task
gulp.task('html', () => {
  return gulp.src(`${paths.src.html}/*.html`)
    .pipe(gulp.dest(paths.dist.html));
});

// Javascript build task
gulp.task('scripts', () => {
  return gulp.src(`${paths.src.scripts}/*.js`)
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest(paths.dist.scripts));
});

// Sass build task
gulp.task('styles', () => {
  return gulp.src(`${paths.src.styles}/main.scss`)
    .pipe(sass())
    .pipe(gulp.dest(paths.dist.styles));
});

gulp.task('default', ['html', 'scripts', 'styles']);

gulp.task('watch', () => {
  gulp.watch(`${paths.src.html}/**/*.html`, ['html']);
  gulp.watch(`${paths.src.scripts}/**/*.js`, ['scripts']);
  gulp.watch(`${paths.src.styles}/**/*.scss`, ['styles']);
});
