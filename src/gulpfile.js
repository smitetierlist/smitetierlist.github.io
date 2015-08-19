(function () {
    'use strict';

    var gulp = require('gulp');
    var inject = require('gulp-inject');
    var gulpBowerFiles = require('gulp-bower-files');
    var concat = require('gulp-concat');
    var series = require('stream-series');
    var del = require('del');

    gulp.task('clean', function (cb) {
        del('../dist/', {force: true}, cb);
    });

    gulp.task('bower', ['clean'], function () {
        gulpBowerFiles().pipe(gulp.dest("../dist/bower_components"));
    });

    gulp.task('angular', ['clean'], function () {
        gulp
            .src(['modules/**/*.module.js', 'modules/**/*.js'])
            .pipe(concat('app.js'))
            .pipe(gulp.dest('../dist/'))
    });

    gulp.task('assets', ['clean'], function () {
        gulp
            .src('assets/**/*')
            .pipe(gulp.dest('../dist/assets/'));
    });

    gulp.task('inject', ['bower', 'angular', 'assets'], function () {
        var vendorStream = gulp.src(['../dist/**/*.js', '!../dist/app.js', '../dist/**/*.css'], {read: false});
        var appStream = gulp.src('../dist/app.js');
        gulp
            .src('index.html')
            .pipe(inject(series(vendorStream, appStream), {relative: true, ignorePath: '../dist/'}))
            .pipe(gulp.dest('../dist/'))
    });

    gulp.task('build', ['bower', 'angular', 'assets']);
    gulp.task('default', ['build', 'inject']);
})();
