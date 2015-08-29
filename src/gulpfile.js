(function () {
    'use strict';

    var gulp = require('gulp');
    var inject = require('gulp-inject');
    var gulpBowerFiles = require('gulp-bower-files');
    var concat = require('gulp-concat');
    var series = require('stream-series');
    var del = require('del');
    var rename = require('gulp-rename');
    var watch = require('gulp-watch');
    var batch = require('gulp-batch');
    var less = require('gulp-less');
    var minifyJS = require('gulp-uglify');
    var minifyCSS = require('gulp-minify-css');
    var minifyHTML = require('gulp-minify-html');
    var minifyInline = require('gulp-minify-inline');
    var autoprefixer = require('gulp-autoprefixer');
    var filter = require('gulp-filter');
    var merge = require('merge-stream');


    gulp.task('clean', function (cb) {
        del.sync('../index.html', {force: true});
        del.sync('../lib/', {force: true});
        cb();
    });

    gulp.task('bower', ['clean'], function () {
        var js = gulpBowerFiles()
            .pipe(filter('**/*.js'))
            .pipe(concat('vendor.js'))
            .pipe(minifyJS())
            .pipe(gulp.dest('../lib/'));
        var css = gulpBowerFiles()
            .pipe(filter('**/*.css'))
            .pipe(concat('vendor.css'))
            .pipe(autoprefixer())
            .pipe(minifyCSS())
            .pipe(gulp.dest('../lib/'));
        return merge(js, css);
    });

    gulp.task('angular', ['clean'], function (cb) {
        gulp
            .src(['modules/**/*.module.js', 'modules/**/*.js'])
            .pipe(concat('app.js'))
            .pipe(minifyJS({mangle:true}))
            .pipe(gulp.dest('../lib/'));

        gulp
            .src('modules/**/*.html')
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest('../lib/template/'));

        cb();
    });

    gulp.task('assets', ['clean'], function (cb) {

        gulp
            .src('assets/styles/**/*.less')
            .pipe(concat('app.less'))
            .pipe(less())
            .pipe(minifyCSS())
            .pipe(autoprefixer())
            .pipe(gulp.dest('../lib/'));

        gulp
            .src(['assets/**/*', '!**/*.less'])
            .pipe(gulp.dest('../lib/assets/'));

        cb();
    });

    gulp.task('inject', ['bower', 'angular', 'assets'], function () {
        // Inject js
        //var vendorJS = gulp.src(['../lib/**/*.js', '!../lib/app.js'], {read: false});
        var vendorJS = gulp.src('../lib/vendor.js', {read: false});
        var customJS = gulp.src('../lib/app.js', {read: false});
        var vendorCSS = gulp.src(['../lib/**/*.css', '!../lib/assets/styles/**/*.css'], {read: false});
        var customCSS = gulp.src('../lib/assets/styles/**/*.css', {read: false});
        return gulp
            .src('index.html')
            .pipe(inject(vendorJS, {relative: true, ignorePath: '../', starttag: '<!-- inject:js:vendor -->'}))
            .pipe(inject(customJS, {relative: true, ignorePath: '../', starttag: '<!-- inject:js:custom -->'}))
            .pipe(inject(vendorCSS, {relative: true, ignorePath: '../', starttag: '<!-- inject:css:vendor -->'}))
            .pipe(inject(customCSS, {relative: true, ignorePath: '../', starttag: '<!-- inject:css:custom -->'}))
            .pipe(minifyHTML())
            .pipe(minifyInline())
            .pipe(gulp.dest('../'));
    });

    gulp.task('build', ['bower', 'angular', 'assets']);

    gulp.task('default', ['build', 'inject']);

    gulp.task('watch', function () {
        watch('**/*', batch(function (events, done) {
            gulp.start('default', done);
        }));
    });
})();
