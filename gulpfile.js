
//helpers
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('nodemon', function() {
  nodemon({
    script:'server.js',
    nodeArgs:['--harmony']
  }).on('restart');
});

gulp.task('default',['nodemon']);
