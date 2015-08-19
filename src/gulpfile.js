(function () {
    var gulp = require('gulp');
    var wiredep = require('wiredep').stream;
    var gulpBowerFiles = require('gulp-bower-files');
    var concat = require('gulp-concat');

    gulp.task('wiredep', function () {
        gulp
            .src('index.html')
            .pipe(wiredep())
            .pipe(gulp.dest('../dist/'));
    });

    gulp.task('bower', function () {
        gulpBowerFiles().pipe(gulp.dest("../dist/bower_components"));
    });

    gulp.task('angular', function () {
        gulp
            .src(['modules/**/*.module.js', 'modules/**/*.js'])
            .pipe(concat('app.js'))
            .pipe(gulp.dest('../dist/'))
    });

    gulp.task('default', ['wiredep', 'bower', 'angular']);
})();
