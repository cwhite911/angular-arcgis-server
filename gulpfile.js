var gulp = require('gulp'),
    Server = require('karma').Server,
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    stylish = require('jshint-stylish');

  var testFiles = [
      'bower_components/angular/angular.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'ags.module.js',
      'services/*.service.js',
      'directives/*.directive.js',
      'services/*.spec.js',
      'directives/*.spec.js'
  ];


    gulp.task('build', function() {
      return gulp.src(['ags.module.js', 'services/*.service.js', './directives/*.directive.js'])
        .pipe(concat({path:'angular-arcgis-server.min.js'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
    });

    gulp.task('compress', function() {
      return gulp.src(['ags.module.js', 'services/*.service.js', 'directives/*.directive.js'])
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
      .pipe(jshint.reporter('jshint-stylish'))
    });

    gulp.task('default', function () {
      nodemon({ script: 'server.js', ext: 'html js'})
      .on('change', ['lint', 'compress', 'html'])
      .on('restart', function () {
        console.log('restarted!');
      });
    });

    gulp.task('test', function (done) {
      new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
      }, done).start();
    });
    // gulp.task('test', function() {
    //   gulp.src(testFiles)
    //   .pipe(jshint())
    //   .pipe(jshint.reporter('jshint-stylish'))
    //   .pipe(karma({
    //     configFile: 'karma.conf.js',
    //     action: 'watch'
    //   }));
    // });
