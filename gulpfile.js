var gulp = require('gulp'),
    karma = require('gulp-karma'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');


  var testFiles = [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'angular-arcgis-server.js',
      'app.js',
      'tests/*.js'
  ];

    gulp.task('test', function() {
      // Be sure to return the stream
      return gulp.src(testFiles)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'run'
      }))
      .on('error', function(err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
    });


    gulp.task('compress', function() {
      gulp.src('angular-arcgis-server.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist'))
    });

    gulp.task('lint', function () {
      gulp.src('angular-arcgis-server.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
    });

    gulp.task('serve', function () {
      nodemon({ script: 'server.js', ext: 'html js'})
      .on('change', ['lint', 'compress'])
      .on('restart', function () {
        console.log('restarted!');
      });
    });

    gulp.task('default', function() {
      gulp.src(testFiles)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'watch'
      }));
    });
