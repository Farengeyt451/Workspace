'use strict';

// Gulp plugins
const gulp = require('gulp'),
			autoprefixer = require('gulp-autoprefixer'),
			bs = require('browser-sync').create(),
			cleancss = require('gulp-clean-css'),
			concat = require('gulp-concat'),
			debug = require('gulp-debug'),
			del = require('del'),
			gulpIf = require('gulp-if'),
			imagemin = require('gulp-imagemin'),
			merge = require('merge-stream'),
			newer = require('gulp-newer'),
			plumber = require('gulp-plumber'),
			pug = require('gulp-pug'),
			rigger = require('gulp-rigger'),
			sass = require('gulp-sass'),
			sourcemaps = require('gulp-sourcemaps'),
			uglify = require('gulp-uglify');

// Variable for NODE_ENV environment
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// Variable for paths
var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		manifest: 'build/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/',
		libsJS: 'build/js/libs/',
		libsCSS: 'build/css/libs/'
	},
	production: {
		html: 'production/',
		js: 'production/js/',
		manifest: 'production/',
		css: 'production/css/',
		img: 'production/img/',
		fonts: 'production/fonts/',
		libsJS: 'production/js/libs/',
		libsCSS: 'production/css/libs/'
	},
	src: {
		html: 'src/**/index.pug',
		js: 'src/js/**/*.js',
		style: 'src/style/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*',
		libsJS: [
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/owl.carousel/dist/owl.carousel.min.js',
			'node_modules/jquery-modal/jquery.modal.min.js'
		],
		libsCSS: [
			'node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
			'node_modules/owl.carousel/dist/assets/owl.theme.default.min.css',
			'node_modules/jquery-modal/jquery.modal.min.css'
		]
	},
	watch: {
		html: 'src/**/*.pug',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: {
		build: 'build/*',
		production: 'production/*'
	},
	copysrc: {
		fontawesom: 'node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/*.*',
		manifest: 'src/manifest.json',
	},
	copydest: {
		fontawesom: 'src/fonts/webfonts/'
	}
};

// Variable for development server
var devconf = {
		server: 'build',
		port: 3000,
		logPrefix: 'Farengeyt451',
		// browser: ['google-chrome', 'firefox'],
		notify: true
};

// Variable for production server
var prodconf = {
		server: 'production',
		port: 3000,
		logPrefix: 'Farengeyt451',
		// tunnel: true,
		notify: true
};

// Gulp task - 'Copy data'
gulp.task('copy', function() {
	var fontawesom = gulp.src([path.copysrc.fontawesom], {since: gulp.lastRun('copy')})
		.pipe(gulp.dest(path.copydest.fontawesom));
	var manifest = gulp.src(path.copysrc.manifest, {since: gulp.lastRun('copy')})
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.manifest), gulp.dest(path.production.manifest)));
	return merge(manifest);
});

// Gulp task - 'Assemble JS libs'
gulp.task('libsJS:concat', function() {
	return gulp.src(path.src.libsJS, {since: gulp.lastRun('libsJS:concat')})
		.pipe(concat('libs.js'))
		.pipe(gulpIf(!isDevelopment, uglify()))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.libsJS), gulp.dest(path.production.libsJS)));
});

// Gulp task - 'Assemble CSS libs'
gulp.task('libsCSS:concat', function() {
	return gulp.src(path.src.libsCSS, {since: gulp.lastRun('libsCSS:concat')})
		.pipe(concat('libs.css'))
		.pipe(gulpIf(!isDevelopment, cleancss()))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.libsCSS), gulp.dest(path.production.libsCSS)));
});

// Gulp task - 'Assemble HTML from Pug'
gulp.task('html:build', function () {
	return gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.html), gulp.dest(path.production.html)))
		.pipe(bs.stream());
});

// Gulp task - 'Assemble JS'
gulp.task('js:build', function () {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(gulpIf(!isDevelopment, uglify()))
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.js), gulp.dest(path.production.js)))
		.pipe(bs.stream());
});

// Gulp task - 'Assemble CSS from SCSS'
gulp.task('style:build', function () {
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({browsers: ['last 5 versions']}))
		.pipe(gulpIf(!isDevelopment, cleancss()))
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.css), gulp.dest(path.production.css)))
		.pipe(bs.stream());
});

// Gulp task - 'Assemble images'
gulp.task('img:build', function () {
	return gulp.src(path.src.img, {since: gulp.lastRun('img:build')})
		.pipe(plumber())
		.pipe(gulpIf(isDevelopment, newer(path.build.img), newer(path.production.img)))
		.pipe(debug({title: 'Images build:'}))
		.pipe(gulpIf(!isDevelopment, imagemin ()))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.img), gulp.dest(path.production.img)))
		.pipe(bs.stream());
});

// Gulp task - 'Assemble fonts'
gulp.task('fonts:build', function() {
	return gulp.src(path.src.fonts, {since: gulp.lastRun('fonts:build')})
		.pipe(plumber())
		.pipe(gulpIf(isDevelopment, newer(path.build.fonts), newer(path.production.fonts)))
		.pipe(debug({title: 'Fonts build:'}))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.fonts), gulp.dest(path.production.fonts)))
		.pipe(bs.stream());
});

// Gulp task - 'Run assembly'
gulp.task('build', gulp.series('copy', gulp.parallel('html:build', 'js:build', 'style:build', 'img:build', 'fonts:build', 'libsJS:concat', 'libsCSS:concat')));

// Gulp task - 'Clean build folder'
gulp.task('build:clean', function () {
	return del(path.clean.build);
});

// Gulp task - 'Clean production folder'
gulp.task('production:clean', function () {
	return del(path.clean.production);
});

// Gulp task - 'Clean build & production folders'
gulp.task('clean', gulp.parallel('build:clean', 'production:clean'));

// Gulp task - 'Run webserver'
gulp.task('webserver', function() {
	bs.init(gulpIf(isDevelopment, devconf, prodconf));
});

// Gulp task - 'Start watching files'
gulp.task('watch', function(){
	gulp.watch([path.watch.html], gulp.series('html:build'));
	gulp.watch([path.watch.style], gulp.series('style:build'));
	gulp.watch([path.watch.js], gulp.series('js:build'));
	gulp.watch([path.watch.img], gulp.series('img:build'));
	gulp.watch([path.watch.fonts], gulp.series('fonts:build'));
});

// Gulp task - 'Run the entire assembly, dev server and gulp-watch'
gulp.task('default', gulp.series('build', gulp.parallel('webserver', 'watch')));
