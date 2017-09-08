var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	concat = require('gulp-concat'),
	eslint = require('gulp-eslint'),
	filter = require('gulp-filter'),
	path = require('path'),
	nodemon = require('gulp-nodemon'),
	reload = browserSync.reload,
	sass = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	babelify = require('babelify'),
	source = require('vinyl-source-stream'),
	dir = {
		src: {
			jsx: 'src/components',
			vendor: 'src/vendor',
			sass: 'src/scss',
		},
		dest: {
			js: 'public/javascript',
			css: 'public/stylesheet',
		},
		sourcemaps: 'sourcemaps',

	}


// Lint JS/JSX files
gulp.task('eslint', () => gulp.src(path.join(dir.src.jsx, '*.js'))
	.pipe(eslint({ baseConfig: { ecmaFeatures: { jsx: true } } }))
	.pipe(eslint.format())
	.pipe(eslint.failAfterError()))

gulp.task('jsx', () =>
	browserify(path.join(dir.src.jsx, 'app.js'))
		.transform(babelify, { presets: [ 'es2015', 'react' ] })
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(concat('app.js'))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write(dir.sourcemaps))
		.pipe(gulp.dest(dir.dest.js))
		.pipe(reload({ stream: true })))

// Compile Sass to CSS
gulp.task('sass', () => {
	var autoprefixerOptions = { browsers: [ 'last 2 versions' ] },
		filterOptions = '**/*.css'

	return sass(path.join(dir.src.sass, 'main.scss'), {
		sourcemap: true,
		style: 'compressed',
	})
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write(dir.sourcemaps))
		.pipe(gulp.dest(dir.dest.css))
		.pipe(filter(filterOptions))
		.pipe(reload({ stream: true }))
})

// Watch JS/JSX and Sass files
gulp.task('watch', () => {
	gulp.watch(path.join(dir.src.jsx, '*.{js,jsx}'), [ 'jsx' ])
	gulp.watch(path.join(dir.src.sass, '*.scss'), [ 'sass' ])
})

// BrowserSync
gulp.task('browsersync', () => {
	browserSync.init({
		proxy: 'http://localhost:4000',
		browser: 'Google Chrome',
		port: 3001,
		notify: true,
	})
})

gulp.task('serve', () => {
	nodemon({
		script: 'app.js',
		ignore: [ 'public/**/*', 'src/**/*' ],
		ext: 'js ejs',
		verbose: true,
		env: { NODE_ENV: 'development' },
	})
})

gulp.task('build', [ 'sass', 'jsx' ])
gulp.task('default', [ 'build', 'serve', 'browsersync', 'watch' ])
