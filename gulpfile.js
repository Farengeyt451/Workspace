"use strict";

//Подключаем gulp и плагины
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require("browser-sync");
const cssmin = require('gulp-minify-css');
const del = require('del');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const rigger = require('gulp-rigger');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const reload = browserSync.reload;
const gulpIf = require('gulp-if');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

//Создаем перемнные где прописаны все пути
var path = {
	build: {					//Указываем куда складывать готовые после сборки файлы
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: {						//Указываем пути откуда брать исходники
		html: 'src/index.pug',
		js: 'src/js/main.js',
		style: 'src/style/main.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	watch: {					//Указываем за изменением каких файлов наблюдать
		html: 'src/**/*.pug',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: 'build/*'
};

//Создаем переменную с настройками Dev сервера:
var config = {
	server: {
		baseDir: "./build"
	},
	tunnel: false,
	host: 'localhost',
	port: 9000,
	logPrefix: "InvaderZ"
};

//Создаем задание собрать HTML
gulp.task('html:build', function () {
	return gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(pug({
			pretty: true
		}))		
		.pipe(gulp.dest(path.build.html))
//		.pipe(reload({stream: true}));
});

//Создаем задание собрать JavaScript
// gulp.task('js:build', function () {
// 	gulp.src(path.src.js)
// 			.pipe(plumber())
// 			.pipe(rigger())
// 			.pipe(sourcemaps.init())
// 			 // .pipe(uglify())
// 			.pipe(sourcemaps.write())
// 			.pipe(gulp.dest(path.build.js))
// 			.pipe(reload({stream: true}));
// });

//Создаем задание собрать SCSS
gulp.task('style:build', function () {
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass())
		.pipe(autoprefixer())
		// .pipe(cssmin())
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
})

// //Создаем задание собрать картинки
// gulp.task('image:build', function () {
// 	gulp.src(path.src.img)
// 			.pipe(plumber())
// 			//.pipe(imagemin ())
// 			.pipe(gulp.dest(path.build.img))
// 			.pipe(reload({stream: true}));
// });

// //Создаем задание собрать шрифты
// gulp.task('fonts:build', function() {
// 	gulp.src(path.src.fonts)
// 			.pipe(plumber())
// 			.pipe(gulp.dest(path.build.fonts))
// });

// //Создаем задание для всей сборки
// gulp.task('build', [
// 	'html:build',
// 	'js:build',
// 	'style:build',
// 	'fonts:build',
// 	'image:build'
// ]);


// //Создаем задание для автоматической сборки при изменении файла
// gulp.task('watch', function(){
// 	gulp.watch([path.watch.html], function(event, cb) {
// 		gulp.start('html:build');
// 	});
// 	gulp.watch([path.watch.style], function(event, cb) {
// 		gulp.start('style:build');
// 	});
// 	gulp.watch([path.watch.js], function(event, cb) {
// 		gulp.start('js:build');
// 	});
// 	gulp.watch([path.watch.img], function(event, cb) {
// 		gulp.start('image:build');
// 	});
// 	gulp.watch([path.watch.fonts], function(event, cb) {
// 		gulp.start('fonts:build');
// 	});
// });

// //Создаем задание для запуска Dev сервера
// gulp.task('webserver', function () {
// 	browserSync(config);
// });

//Создаем задание для очистки папки build
gulp.task('clean', function (cb) {
	return del(path.clean, cb);
})

gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('html:build', 'style:build')));

// //Создаем задание для запуска всей сборки, Dev сервера и gulp-watch
// gulp.task('default', ['build', 'webserver', 'watch']);