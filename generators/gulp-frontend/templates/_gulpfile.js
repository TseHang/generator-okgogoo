const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');
const gulpCleanCss = require('gulp-clean-css');
const gulpCompass = require('gulp-compass');
const gulpHbsRouter = require('gulp-hbs-router');
const gulpMinifyHTML = require('gulp-minify-html');

const gulpWebServer = require('gulp-webserver');
const gulpPlumber = require('gulp-plumber'); // 記錄錯誤訊息，並不會讓gulp停止
const gulpConcat = require('gulp-concat');
const gulpImagemin = require('gulp-imagemin');
const gulpRename = require('gulp-rename');
const chalk = require('chalk');
/*
	`gulp`: build sass , js , hbs
  `gulp minify`: Compress css, js, html, image
*/
gulp.task('default', ['sass', 'js', 'hbs', 'webserver', 'watch']);
gulp.task('minify', ['js', 'sass', 'hbs', 'minify-js', 'minify-css', 'minify-html', 'compress-image']);

gulp.task('webserver', () => {
  gulp.src('./')
    .pipe(gulpWebServer({
      livereload: true,
      directoryListing: true,
      open: true,
    }));
});

gulp.task('sass', () => {
  gulp
    .src('./sass/**/*.scss')
    .pipe(gulpPlumber())
    .pipe(gulpCompass({
      config_file: './config.rb',
      css: './dist/css',
      sass: 'sass',
      time: true,
      comments: false, // Do not include comments
    }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('js', () => {
  gulp
    .src('./js/**/*.js')
    .pipe(gulpPlumber())
    .pipe(gulpBabel({
      presets: ['es2015'],
    }))
    .pipe(gulpRename(path => console.log(`\n    ${chalk.yellow('write')} '${path.basename}${path.extname}'`)))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('hbs', () => {
  gulp
    .src('./layout/**/*.hbs')
    .pipe(gulpPlumber())
    .pipe(gulpHbsRouter({
      cwdPath: `${__dirname}/`,
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', () => {
  gulp.watch('./js/**/*.js', ['js']);
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('./layout/**/*.hbs', ['hbs']);
});

gulp.task('minify-css', () => {
  gulp
    .src('./dist/css/**/*.css')
    .pipe(gulpPlumber())
    .pipe(gulpCleanCss({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('minify-js', () => {
  gulp
    .src('./dist/**/*.js')
    .pipe(gulpPlumber())
    .pipe(gulpUglify())
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('minify-html', () => {
  gulp
    .src(['./**/*.html', '!node_modules/**/*.html'])
    .pipe(gulpPlumber())
    .pipe(gulpMinifyHTML())
    .pipe(gulpRename(path => console.log(`\n    ${chalk.bgMagenta('minify')} '${path.basename}${path.extname}'`)))
    .pipe(gulp.dest('./'));
});

/*
	【 Concat library .css/.js 】
  input: src/
  output: lib/
*/
gulp.task('concat-css', () => {
  gulp
    .src('./src/**/*.css')
    .pipe(gulpPlumber())
    .pipe(gulpCleanCss({ debug: true }, (details) => {
      console.log(`${details.name} : ${details.stats.originalSize}`);
      console.log(`${details.name} : ${details.stats.minifiedSize}`);
    }))
    .pipe(gulpConcat('library.min.css'))
    .pipe(gulpRename(path => console.log(`\n    ${chalk.green('concat')} '${path.basename}${path.extname}'`)))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('concat-js', () => {
  gulp
    .src('./src/**/*.js')
    .pipe(gulpPlumber())
    .pipe(gulpUglify())
    .pipe(gulpConcat('library.min.js'))
    .pipe(gulpRename(path => console.log(`\n    ${chalk.green('concat')} '${path.basename}${path.extname}'`)))
    .pipe(gulp.dest('./lib/'));
});

/*
	【 Compress images 】
  input: dist/img/
  output: dist/img/
*/
gulp.task('compress-image', () => {
  gulp
    .src('./dist/img/**/**')
    .pipe(gulpPlumber())
    .pipe(gulpImagemin())
    .pipe(gulp.dest('./dist/img/'));
});
