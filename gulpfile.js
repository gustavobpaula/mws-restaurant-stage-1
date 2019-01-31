'use strict';

const
	gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	del = require('del'),
	bs = require('browser-sync'),
	named = require('vinyl-named'),
	cleanCSS = require('gulp-clean-css');

const paths = {
	scripts: 'js/**/*.js',
	style: 'styles/**/*.scss',
	html: '*.html',

	dest: {
		default: 'build'
	}
};

const getPath = source => {

	return [paths[source]];
};


gulp.task('scripts', () => {
	return gulp.src(getPath('scripts'))
		.pipe($.plumber())
		.pipe(named())
		.pipe(gulp.dest(`${paths.dest.default}/js`));
});



gulp.task('clean', () => {

	return del.sync('build');
});


gulp.task('server', ['watch'], () => {

	bs({
		files: ['build/**', '!build/**/*.map'],
		server: {
			baseDir: ['build', './']
		},
		open: !$.util.env.no
	});

});

gulp.task('style', function () {
	return gulp.src(paths.style)
		.pipe($.sass({
			errLogToConsole: true,
			outputStyle: $.util.env.production ? 'compressed' : 'nested',
			includePaths: [
				'src/Styles',
				'node_modules/'
			]
		}).on('error', $.sass.logError))
		.pipe($.util.env.production ? cleanCSS({ compatibility: 'ie8' }) : $.util.noop())
		.pipe(gulp.dest(`${paths.dest.default}/css`));
});


gulp.task('html', function () {
	return gulp.src(paths.html)
		.pipe(gulp.dest(paths.dest.default));
});

gulp.task('watch', ['scripts', 'style', 'html'], () => {

	gulp.watch(getPath('scripts'), ['scripts']);
	gulp.watch(getPath('style'), ['style']);
	gulp.watch(getPath('html'), ['html']);
});

gulp.task('default', ['clean'], () => {

	gulp.start('server');
});
