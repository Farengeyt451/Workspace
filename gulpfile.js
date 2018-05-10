"use strict";

// Подключаем gulp и плагины
const gulp = require("gulp"),
			autoprefixer = require("gulp-autoprefixer"),
			bs = require("browser-sync").create(),
			cleancss = require("gulp-clean-css"),
			debug = require("gulp-debug"),
			del = require("del"),
			gulpIf = require("gulp-if"),
			imagemin = require("gulp-imagemin"),
			newer = require("gulp-newer"),
			plumber = require("gulp-plumber"),
			pug = require("gulp-pug"),
			rigger = require("gulp-rigger"),
			sass = require("gulp-sass"),
			sourcemaps = require("gulp-sourcemaps"),
			uglify = require("gulp-uglify"),
			merge = require("merge-stream"),
			concat = require("gulp-concat");

// Создаем переменную окружения NODE_ENV
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

// Создаем перемнные где прописаны все пути
var path = {
	build: {					// Указываем куда перемещать готовые после сборки файлы (build)
		html: "build/",
		js: "build/js/",
		manifest: "build/",
		css: "build/css/",
		img: "build/img/",
		fonts: "build/fonts/",
		libsJS: "build/js/libs/",
		libsCSS: "build/css/libs/"
	},
	production: {				// Указываем куда перемещать готовые после сборки файлы (production)
		html: "production/",
		js: "production/js/",
		manifest: "production/",
		css: "production/css/",
		img: "production/img/",
		fonts: "production/fonts/",
		libsJS: "production/js/libs/",
		libsCSS: "production/css/libs/"
	},
	src: {						// Указываем пути откуда брать исходники
		html: "src/**/*.pug",
		js: ["src/js/*.js", "src/js/pages/*.js"],
		style: ["src/style/*.scss", "src/style/pages/*.scss"],
		img: "src/img/**/*.*",
		fonts: "src/fonts/**/*.*",
		libsJS: ["node_modules/jquery/dist/jquery.min.js"],
		libsCSS: [" "]
	},
	watch: {					// Указываем за изменением каких файлов наблюдать
		html: "src/**/*.pug",
		js: "src/js/**/*.js",
		style: "src/style/**/*.scss",
		img: "src/img/**/*.*",
		fonts: "src/fonts/**/*.*"
	},
	clean: {				// Указываем пути очистки директорий build и production
		build: "build/*",
		production: "production/*"
	},
	copy: {
		// jquery: "node_modules/jquery/dist/jquery.js",
		// mmenu: "node_modules/jquery.mmenu/dist/jquery.mmenu.all.js",
		// hamburgers: "node_modules/hamburgers/dist/hamburgers.css",
		// mmenucss: "node_modules/jquery.mmenu/dist/jquery.mmenu.all.css",
		fontawesom: "node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/*.*",
		manifest: "src/manifest/manifest.json",
	},
	copydest: {
		srcLibsJS: "src/js/libs/",
		srcLibsCSS: "src/style/libs/",
		fontawesom: "build/fonts/webfonts/"
	}
};

// Создаем перемнную настроек Dev сервера (build)
var devconf = {
		server: "build",
		port: 3000,
		logPrefix: "Farengeyt451",
		// browser: ["google-chrome", "firefox"],
		notify: true
};

// Создаем перемнную настроек Dev сервера (production)
var prodconf = {
		server: "production",
		port: 3000,
		logPrefix: "Farengeyt451",
		// tunnel: true,
		notify: true
};

// Создаем задание скопировать данные
gulp.task("copy", function() {
	// var js = gulp.src([path.copy.jquery], {since: gulp.lastRun("copy")})
		// .pipe(gulp.dest(path.copydest.srcLibsJS));
	var fontawesom = gulp.src([path.copy.fontawesom], {since: gulp.lastRun("copy")})
		.pipe(gulp.dest(path.copydest.fontawesom));
	var manifest = gulp.src(path.copy.manifest, {since: gulp.lastRun("copy")})
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.manifest), gulp.dest(path.production.manifest)));
	return merge(manifest);
});

// Создаем задание сконкатенировать js библиотеки
gulp.task("libsJS:concat", function() {
	return gulp.src(path.src.libsJS, {since: gulp.lastRun("libsJS:concat")})
		.pipe(concat("libs.js"))
		.pipe(uglify())
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.libsJS), gulp.dest(path.production.libsJS)))
});

// Создаем задание сконкатенировать css библиотеки
gulp.task("libsCSS:concat", function() {
	return gulp.src(path.src.libsCSS, {since: gulp.lastRun("libsCSS:concat")})
		.pipe(concat("libs.css"))
		.pipe(cleancss())
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.libsCSS), gulp.dest(path.production.libsCSS)))
});

// Создаем задание собрать HTML
gulp.task("html:build", function () {
	return gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.html), gulp.dest(path.production.html)))
		.pipe(bs.stream());
});

// Создаем задание собрать JavaScript
gulp.task("js:build", function () {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(gulpIf(!isDevelopment, uglify()))
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.js), gulp.dest(path.production.js)))
		.pipe(bs.stream());
});

// Создаем задание собрать SCSS
gulp.task("style:build", function () {
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({browsers: ["last 5 versions"]}))
		.pipe(gulpIf(!isDevelopment, cleancss()))
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.css), gulp.dest(path.production.css)))
		.pipe(bs.stream());
});

// Создаем задание собрать картинки
gulp.task("img:build", function () {
	return gulp.src(path.src.img, {since: gulp.lastRun("img:build")})
		.pipe(plumber())
		.pipe(gulpIf(isDevelopment, newer(path.build.img), newer(path.production.img)))
		.pipe(debug({title: "Images build:"}))
		.pipe(gulpIf(!isDevelopment, imagemin ()))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.img), gulp.dest(path.production.img)))
		.pipe(bs.stream());
});

// Создаем задание собрать шрифты
gulp.task("fonts:build", function() {
	return gulp.src(path.src.fonts, {since: gulp.lastRun("fonts:build")})
		.pipe(plumber())
		.pipe(gulpIf(isDevelopment, newer(path.build.fonts), newer(path.production.fonts)))
		.pipe(debug({title: "Fonts build:"}))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.fonts), gulp.dest(path.production.fonts)))
		.pipe(bs.stream());
});

// Создаем задание для всей сборки
gulp.task("build", gulp.parallel("copy", "html:build", "js:build", "style:build", "img:build", "fonts:build", "libsJS:concat", "libsCSS:concat"));

// Создаем задание для очистки папки build
gulp.task("build:clean", function () {
	return del(path.clean.build);
});

// Создаем задание для очистки папки production
gulp.task("production:clean", function () {
	return del(path.clean.production);
});

// Создаем задание для очистки папок build и production
gulp.task("clean", gulp.parallel("build:clean", "production:clean"));

// Создаем задание для запуска Dev сервера
gulp.task("webserver", function() {
	bs.init(gulpIf(isDevelopment, devconf, prodconf));
});

// Создаем задание для слежения за файлами
gulp.task("watch", function(){
	gulp.watch([path.watch.html], gulp.series("html:build"));
	gulp.watch([path.watch.style], gulp.series("style:build"));
	gulp.watch([path.watch.js], gulp.series("js:build"));
	gulp.watch([path.watch.img], gulp.series("img:build"));
	gulp.watch([path.watch.fonts], gulp.series("fonts:build"));
});

// Создаем задание для запуска всей сборки, Dev сервера и gulp-watch
gulp.task("default", gulp.series("build", gulp.parallel("webserver", "watch")));
