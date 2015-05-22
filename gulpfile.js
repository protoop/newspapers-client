'use strict';

var browserify              = require('browserify'),
    browserSync             = require('browser-sync'),
    buffer                  = require('vinyl-buffer'),
    changed                 = require('gulp-changed'),
    del                     = require('del'),
    gulp                    = require('gulp'),
    gulp_clean              = require('gulp-clean'),
    gulp_concat             = require('gulp-concat'),
    gulp_html_replace       = require('gulp-html-replace'),
    gulp_less               = require('gulp-less'),
    gulp_minify_css         = require('gulp-minify-css'),
    gulp_rename             = require('gulp-rename'),
    gulp_strip_css_comments = require('gulp-strip-css-comments'),
    gulp_util               = require('gulp-util'),
    source                  = require('vinyl-source-stream'),
    uglify                  = require('gulp-uglify'),
    watchify                = require('watchify'),
    babelify                = require('babelify'),

    reload = browserSync.reload,

    paths = {
        src : {
            app_entry_point : 'app/src/js/app.js',
            bundle : 'app.js',
            scripts: ['app/src/js/**/*.js'],
            styles: {
                css: ['node_modules/basscss/css/basscss.css', 'app/src/styles/**/*.css'],
                less: ['app/src/styles/**/*.less']
            },
            html: 'app/src/**/*.html'
        },
        dist: {
            root: 'app/dist/',
            js: 'app/dist/js/',
            css: 'app/dist/css/'
        }
    };

// Clean ---------------------------------------------------------------------------------------------------------------

gulp.task('clean', function () {
    return gulp.src([paths.dist.js + '*.js',
        paths.dist.css + '*.css',
        paths.dist.root + '*.html'], {read: false})
        .pipe(gulp_clean())
        .on('error', gulp_util.log);
});

// Dist : HTML ---------------------------------------------------------------------------------------------------------

gulp.task('copy-html', function(){
    return gulp.src(paths.src.html)
        .pipe(gulp_html_replace({
            'css': 'css/app.min.css',
            'js': 'js/app.js'
        }))
        .pipe(gulp.dest(paths.dist.root))
        .pipe(reload({ stream:true }))
        .on('error', gulp_util.log);
});

// Dist : CSS/LESS -----------------------------------------------------------------------------------------------------

gulp.task('styles-less', function () {
    return gulp.src(paths.src.styles.less)
        .pipe(gulp_less())
        .pipe(gulp_concat('concat-less.css'))
        .pipe(gulp.dest(paths.dist.css))
        .on('error', gulp_util.log);
});

gulp.task('styles-css', function () {
    return gulp.src(paths.src.styles.css)
        .pipe(gulp_concat('concat-css.css'))
        .pipe(gulp.dest(paths.dist.css))
        .on('error', gulp_util.log);
});

gulp.task('concat-and-minify-styles', ['styles-less', 'styles-css'],function () {
    return gulp.src([paths.dist.css + 'concat-css.css', paths.dist.css + 'concat-less.css'])
        .pipe(gulp_concat('concat.css'))
        .pipe(gulp_strip_css_comments({all: true}))
        .pipe(gulp_minify_css())
        .pipe(gulp_rename('app.min.css'))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(reload({ stream:true }))
        .on('error', gulp_util.log);
});

gulp.task('styles-clean', ['concat-and-minify-styles'], function () {
    return gulp.src([paths.dist.css + 'concat-css.css', paths.dist.css + 'concat-less.css'], {read: false})
        .pipe(gulp_clean())
        .on('error', gulp_util.log);
});

//----------------------------------------------------------------------------------------------------------------------

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'app/dist'
        }
    });
});

//----------------------------------------------------------------------------------------------------------------------

gulp.task('watchify', function() {
    var bundler = watchify(browserify(paths.src.app_entry_point, watchify.args));

    function rebundle() {
        return bundler
            .bundle()
            .on('error', gulp_util.log)
            .pipe(source(paths.src.bundle))
            .pipe(gulp.dest(paths.dist.js))
            .pipe(reload({stream: true}));
    }

    bundler.transform(babelify)
        .on('update', rebundle);
    return rebundle();
});

//----------------------------------------------------------------------------------------------------------------------

gulp.task('browserify', function() {
    browserify(paths.src.app_entry_point)
        .transform(babelify)
        .bundle()
        .pipe(source(paths.src.bundle))
        .pipe(buffer())
        .pipe(uglify({mangle: true}))
        .pipe(gulp.dest(paths.dist.js));
});

//----------------------------------------------------------------------------------------------------------------------

gulp.task('watch-app-content', function() {
    gulp.watch('app/src/**/*.html', ['copy-html']);
    gulp.watch('app/src/js/**/*.js', ['']); /* JS : already watched by watchify */
    gulp.watch('app/src/styles/**/*.{css,less}', ['concat-and-minify-styles']);
});

gulp.task('watch', ['copy-html'], function() {
    gulp.start(['browserSync', 'watch-app-content', 'watchify']);
});

gulp.task('build', ['copy-html'], function() {
    gulp.start(['browserify', 'styles-clean']);
});

gulp.task('default', function() {
    console.log('Run "gulp watch or gulp build"');
});
