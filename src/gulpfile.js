(function () {
    'use strict';

    var gulp = require('gulp');
    var inject = require('gulp-inject');
    var gulpBowerFiles = require('gulp-bower-files');
    var concat = require('gulp-concat');
    var series = require('stream-series');
    var del = require('del');

    gulp.task('clean', function (cb) {
        del.sync('../index.html', {force: true});
        del.sync('../lib/', {force: true});
        cb();
    });

    gulp.task('bower', ['clean'], function () {
        return gulpBowerFiles()
            .pipe(gulp.dest("../lib/"));
    });

    gulp.task('angular', ['clean'], function (cb) {
        gulp
            .src(['modules/**/*.module.js', 'modules/**/*.js'])
            .pipe(concat('app.js'))
            .pipe(gulp.dest('../lib/'));

        gulp
            .src('modules/**/*.html')
            .pipe(gulp.dest('../lib/template/'));

        cb();
    });

    gulp.task('assets', ['clean'], function () {
        return gulp
            .src('assets/**/*')
            .pipe(gulp.dest('../lib/assets/'));
    });

    gulp.task('inject', ['bower', 'angular', 'assets'], function () {
        var vendorStream = gulp.src(['../lib/**/*.js', '!../lib/app.js', '../lib/**/*.css'], {read: false});
        var appStream = gulp.src('../lib/app.js');
        gulp
            .src('index.html')
            .pipe(inject(series(vendorStream, appStream), {relative: true, ignorePath: '../'}))
            .pipe(gulp.dest('../'));
    });

    gulp.task('build', ['bower', 'angular', 'assets']);
    gulp.task('default', ['build', 'inject']);
})();
