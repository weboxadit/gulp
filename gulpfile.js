var gulp = require('gulp');
var uglify = reqiure('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('scripts',function(){
	gulp.src('src/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist'))
})

