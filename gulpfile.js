var gulp = require('gulp'),
    karma = require('gulp-karma'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
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

    gulp.task('build', function() {
      return gulp.src(['ags.module.js', 'services/*.js', './directives/*.js'])
        .pipe(concat({path:'angular-arcgis-server.min.js'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
    });

    gulp.task('compress', function() {
      return gulp.src(['ags.module.js', 'services/*.js', 'directives/*.js'])
        .pipe(concat({path:'angular-arcgis-server.js'}))
        // .pipe(uglify())
        .pipe(gulp.dest('dist'))
    });

    gulp.task('html', function() {
      return gulp.src(['directives/**/*.html'])
        .pipe(gulp.dest('dist'))
    });

    gulp.task('lint', function () {
      gulp.src(['ags.module.js', 'services/*.js', 'directives/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
    });

    gulp.task('serve', function () {
      nodemon({ script: 'server.js', ext: 'html js'})
      .on('change', ['lint', 'compress', 'html'])
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
