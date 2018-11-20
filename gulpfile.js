var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	minifyCSS = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	qunit = require('gulp-qunit'),
	replace = require('gulp-replace'),
	fs = require('fs'),
	// Replace disclaimer
	disclaimer = fs.readFileSync('src/disclaimer', "utf8"),
	disclaimerRegExp = /\{disclaimer\}/,
	// Replace package.version
	version = require('./package').version,
	versionRegExp = /\{package\.version\}/;

// Rename and uglify scripts
function js(prefix) {
	return gulp.src('src/clockpicker.js')
		.pipe(rename({
			prefix: prefix + '-'
		}))
		.pipe(replace(disclaimerRegExp, disclaimer))
		.pipe(replace(versionRegExp, version))
		.pipe(gulp.dest('dist'))
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'));
}

// Rename, concat and minify stylesheets
function css(prefix) {
	var stream;
	if (prefix === 'bootstrap') {
		stream = gulp.src('src/clockpicker.css');
	} else {
		// Concat with some styles picked from bootstrap
		stream = gulp.src(['src/standalone.css', 'src/clockpicker.css'])
			.pipe(concat('clockpicker.css'));
	}
	return stream.pipe(rename({
			prefix: prefix + '-'
		}))
		.pipe(replace(disclaimerRegExp, disclaimer))
		.pipe(replace(versionRegExp, version))
		.pipe(gulp.dest('dist'))
		.pipe(minifyCSS({
			keepSpecialComments: 1
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'));
}

gulp.task('js', function(done) {
	js('bootstrap');
	js('jquery');
	done();
});

gulp.task('css', function(done) {
	css('bootstrap');
	css('jquery');
	done();
});

gulp.task('watch', function(done) {
	gulp.watch('src/*.js', gulp.series('js'));
	gulp.watch('src/*.css', gulp.series('css'));
	done();
});

gulp.task('test', function() {
    return gulp.src('test/*.html')
        .pipe(qunit());
});

gulp.task('default', gulp.series('js', 'css', 'watch'));
