'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var serve = require('gulp-serve');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');

var bundler = watchify(browserify('./src/app.js', watchify.args));
// add any other browserify options or transforms here

// Copy all static assets
gulp.task('copy', function() {
    gulp.src('static/**')
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('serve', serve('dist'));

gulp.task('js', bundle); // so you can run `gulp js` to build the file
bundler.on('update', bundle); // on any dep update, runs the bundler

function bundle() {
    return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // optional, remove if you dont want sourcemaps
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        })) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        //
        .pipe(gulp.dest('./dist/js'))
        .pipe(livereload());
}

gulp.task('default', function() {
    gulp.run('copy', 'js', 'serve');
    gulp.watch([
        'static/**'
    ], function() {
        gulp.run('copy');
    });
    livereload.listen();
});
