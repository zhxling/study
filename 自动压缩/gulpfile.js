// 添加依赖
var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require("gulp-uglify");
var minifyCss = require("gulp-minify-css");
var minifyHtml = require("gulp-minify-html");


//存需要处理的文件路径
var paths = {
	uglify: ['./js/*.js'],
	minifyCss: ['./css/*.css'],
	minifyHtml: ['./html/*.html'],
	less: ['./less/*.less']
};

//执行任务
gulp.task('minify-js', function () {
    gulp.src(paths.uglify) // 要压缩的js文件
    .pipe(uglify())  //使用uglify进行压缩
    .pipe(gulp.dest('./minify-js')); //压缩后的路径
});

gulp.task('minify-css', function () {
    gulp.src(paths.minifyCss) // 要压缩的css文件
    .pipe(minifyCss()) //压缩css
    .pipe(gulp.dest('./minify-css'));
});

gulp.task('minify-html', function () {
    gulp.src(paths.minifyHtml) // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(gulp.dest('./minify-html'));
});

gulp.task('less', function () {
	gulp.src(paths.less)
	.pipe(less())
	.pipe(gulp.dest('./css'));
});


//监控某个路径下文件的改变，而自动执行指定的脚本。
gulp.task('watch', function() {
	gulp.watch(paths.uglify, ['minify-js']);
	gulp.watch(paths.minifyCss, ['minify-css']);
	gulp.watch(paths.minifyHtml, ['minify-html']);
	gulp.watch(paths.less, ['less']);
});