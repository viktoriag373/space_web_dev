const {src, dest, watch, parallel, series} = require('gulp');

const scss         = require('gulp-sass');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const del          = require('del');

function buildHtml() {
    return src('app/source/index.html')
        .pipe(dest('app/build/'))
        .pipe(browserSync.stream())
}

function buildStyles() {
    return src('app/source/scss/style.scss')
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowsersList: ['last 10 version']
        }))
        .pipe(dest('app/build/css'))
        .pipe(browserSync.stream())
}

function buildScripts() {
    return src([
        'app/source/js/script.js'

    ])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('app/build/js'))
        .pipe(browserSync.stream())
}

function buildImage() {
    return src('app/source/img/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('app/build/img'))
}

function sourceWatching() {
    watch(['app/source/*.html'], buildHtml)
    watch(['app/source/scss/**/*.scss'], buildStyles)
    watch(['app/source/js/**/*.js'], buildScripts)
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir:"app/build/"
        }
    });
}

const build = parallel(
    buildHtml,
    buildStyles,
    buildScripts,
    buildImage
)


function clean() {
    return del('app/build')
}

exports.buildHtml = buildHtml;
exports.buildStyles = buildStyles;
exports.buildScripts = buildScripts;
exports.buildImage = buildImage;
exports.sourceWatching = sourceWatching;
exports.browsersync = browsersync;
exports.clean = clean;
exports.build = build;



exports.default = series(
    clean,
    build,
    parallel (
        sourceWatching, 
        browsersync  
    ) 
   
);