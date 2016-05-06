var gulp = require('gulp');
var gulpFilter = require('gulp-filter');
var bower = require('gulp-bower-files');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var include = require('gulp-include');
var stylus = require('gulp-stylus');
var coffee = require('gulp-coffee');
var cssmin = require('gulp-minify-css');
var sass = require('gulp-sass');

var src = {
    styl: ['assets/**/*.styl'],
    css: ['assets/**/*.css'],
    coffee: ['scripts/**/*.coffee'],
    js: ['scripts/**/*.js', 'views/**/*.js'],
    bower: ['bower.json', '.bowerrc']
};
src.styles = src.styl.concat(src.css);
src.scripts = src.coffee.concat(src.js);

var publishdir = './wwwroot/';
var dist = {
    all: [publishdir + '/**/*'],
    css: publishdir + '/static/',
    js: publishdir + '/scripts/',
    vendor: publishdir + '/scripts/'
};


gulp.task('images', function () {
    gulp.src('./assets/images/*.*')
      .pipe(gulp.dest(publishdir + '/assets/images'));
});

gulp.task('pages', function () {
    gulp.src('./views/**/*.html')
      .pipe(gulp.dest(publishdir + '/views'));

    gulp.src('./*.html')
      .pipe(gulp.dest(publishdir));

});


//
// concat *.js to `vendor.js`
//
gulp.task('bower', function() {
    var jsFilter = gulpFilter('**/*.js');
    return bower()
        .pipe(jsFilter)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(dist.js));
});

gulp.task('sass', function () {
    var cssFiles = ['./views/**/*.scss'];
    gulp.src(cssFiles)
      .pipe(concat('views.css'))
      .pipe(sass.sync())
      //.pipe(minifyCSS())
      .pipe(gulp.dest(dist.css));

});

function buildCSS() {
    return gulp.src(src.styles)
        .pipe(stylus({ use: ['nib'] }))
        .pipe(concat('app.css'))
        .pipe(gulp.dest(dist.css));
}

function buildJS() {
    return gulp.src(src.scripts)
        .pipe(include())
        //.pipe(coffee())
        //.pipe(browserify({
        //    insertGlobals: true,
        //    extensions: ['.coffee'],
        //    debug: true
        //}))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(dist.js));
}
function buildassetJS() {
    return gulp.src('./assets/js/*.js')
      .pipe(gulp.dest(publishdir + '/assets/js'));
}
gulp.task('assetjs', buildassetJS);

gulp.task('css', buildCSS);
gulp.task('js', buildJS);

gulp.task('watch', function() {
    gulp.watch(src.bower, ['bower']);
    watch({ glob: src.styles, name: 'app.css' }, buildCSS);
    watch({ glob: src.scripts, name: 'app.js' }, buildJS);
});


gulp.task('compress-css', ['css'], function() {
    return gulp.src(dist.css)
        .pipe(cssmin())
        .pipe(gulp.dest(dist.css));
});
gulp.task('compress-js', ['js'], function() {
    return gulp.src(dist.js)
        .pipe(uglify())
        .pipe(gulp.dest(dist.js));
});
gulp.task('compress', ['compress-css', 'compress-js']);

gulp.task('default', ['bower', 'css', 'js', 'assetjs', 'pages', 'images', 'sass']); // development
gulp.task('build', ['bower', 'compress', 'assetjs', 'pages', 'images', 'sass']); // build for production