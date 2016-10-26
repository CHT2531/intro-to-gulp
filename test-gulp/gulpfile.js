var gulp = require('gulp');
var less = require('gulp-less');

var browserSync = require('browser-sync').create();

var cssnano = require('gulp-cssnano');

gulp.task('less', function(){
  return gulp.src('app/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('app/css'))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    browser:["iexplore", "chrome"]
  })

})


gulp.task('browserSyncReload', function(){
  browserSync.reload();
})

gulp.task('watch',['browserSync','less'],function(){
	gulp.watch("app/less/style.less", ['less']);
	gulp.watch("app/css/*.css", ['browserSyncReload']);	
	gulp.watch("app/**/*.html", ['browserSyncReload']);
})
gulp.task('move-html', function() {
  return gulp.src('app/**/*.html')
  .pipe(gulp.dest('dist'))
})

gulp.task('minify-css', function() {
    return gulp.src('app/css/style.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('build',['move-html','minify-css'], function() {
    console.log("Build complete")
});