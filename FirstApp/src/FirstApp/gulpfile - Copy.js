
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

// Define default destination folder
var dest = './wwwroot/';

gulp.task('sass', function () {

    gulp.src(plugins.mainBowerFiles())
      .pipe(plugins.filter(['*.css']))
      .pipe(plugins.concat('libs.css'))
      .pipe(minifyCSS())
      .pipe(gulp.dest(dest + 'css'));


    //var cssFiles = ['./stylesheets/variables.scss', './views/**/*.scss'];
    //gulp.src(cssFiles)
    //  .pipe(plugins.concat('views.css'))
    //  .pipe(sass.sync())
    //  //.pipe(minifyCSS())
    //  .pipe(gulp.dest(dest + 'css'));

    //gulp.src('./stylesheets/fonts/*.*')
    //  .pipe(gulp.dest(dest + 'css/fonts'));

    //gulp.src('./stylesheets/htc/*.*')
    //  .pipe(gulp.dest(dest + 'css/htc'));
});

gulp.task('scripts', function () {
    var jsFiles = ['./scripts/**/**.js', './views/authentication/*.js', './views/home/*.js'];

    gulp.src(plugins.mainBowerFiles().concat(jsFiles))
    .pipe(plugins.sourcemaps.init({ loadMaps: true }))
    .pipe(plugins.filter('*.js'))
    .pipe(plugins.concat('app.js'))
    //.pipe(plugins.uglify())
    //.pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(dest + 'js'));
});

//gulp.task('images', function () {
//    gulp.src('./images/**/*.*')
//      .pipe(gulp.dest(dest + 'images'));
//});

gulp.task('pages', function () {
    gulp.src('./views/**/*.html')
      .pipe(gulp.dest(dest + '/views'));

    gulp.src('./*.html')
      .pipe(gulp.dest(dest));

});

//gulp.task('build', ['images', 'sass', 'scripts', 'pages']);
gulp.task('build', ['sass', 'scripts', 'pages']);

gulp.task('dev:watch', function () {
    gulp.watch('./views/**/*.scss', ['sass']);
    gulp.watch('./stylesheets/style.scss', ['sass']);
    gulp.watch('./stylesheets/*.scss', ['sass']);
    gulp.watch('./app/**/*.js', ['scripts']);
    gulp.watch('./images/**/*.*', ['images']);
    gulp.watch('./*.html', ['pages']);
    gulp.watch('./views/**', ['pages']);
});

//gulp.task('dev', ['build', 'dev:watch']);
gulp.task('dev', ['build']);