// Require all the things
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var imagemin    = require('gulp-imagemin');
var cp          = require('child_process');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');

// Static Server + watching scss/html files
gulp.task('serve', ['build-jekyll', 'sass', 'images', 'js', 'fonts', 'vendor'], function() {

    browserSync.init({
        server: "./docs"
    });

    gulp.watch("src/scss/**/*.scss", ['sass']).on('change', browserSync.reload);
    gulp.watch("src/images/**/*.*", ['images']).on('change', browserSync.reload);
    gulp.watch("src/images/**/*.*", ['fonts']).on('change', browserSync.reload);
    gulp.watch("src/vendor/**/*.*", ['js']).on('change', browserSync.reload);
    gulp.watch("src/jekyll/**/*.html", ['build-jekyll']).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/main.scss")
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest("docs/css"))
        .pipe(browserSync.stream());
});

// Copy fonts in the production folder
gulp.task('fonts', function() {
    return gulp.src("src/fonts/**/*.*")
        .pipe(gulp.dest("docs/fonts/"))
        .pipe(browserSync.stream());
});

// Copy and reduce image size
gulp.task('images', () =>
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('docs/images'))
        .pipe(browserSync.stream())
);

// Copy vendor files
gulp.task('vendor', () =>
    gulp.src('src/vendor/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('docs/vendor'))
        .pipe(browserSync.stream())
);

// Scripts
gulp.task('js', function() {
  return gulp.src(['src/vendor/js/lightbox-plus-jquery.min.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('docs/js'));
})

// Rebuild Jekyll
gulp.task('build-jekyll', (code) => {
  return cp.spawn('C:\\Ruby23-x64\\bin\\jekyll.bat', ['build', '--incremental' ], {stdio: 'inherit'}) // Adding incremental reduces build time.
    .on('error', (error) => gutil.log(gutil.colors.red(error.message)))
    .on('close', code);
});

gulp.task('default', ['serve']);