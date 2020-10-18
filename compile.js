const gulp = require('gulp');
const babel = require('gulp-babel');
var uglify = require('gulp-uglify')
function runTask(toRun) {
    const metadata = { task: toRun };
    const taskInstance = gulp.task(toRun);
    if (taskInstance === undefined) {
        console.log('task_not_found', metadata);
        return;
    }
    const start = process.hrtime();
    console.log('task_start', metadata);
    try {
        taskInstance.apply(gulp);
        metadata.hrDuration = process.hrtime(start);
        console.log('task_stop', metadata);
        gulp.emit('stop');
    } catch (err) {
        err.hrDuration = process.hrtime(start);
        err.task = metadata.task;
        console.log('task_err', err);
    }
}
module.exports =function () {
    gulp.task('compile-with-lib', () => {
        return gulp.src('src/**.js')
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .pipe(uglify())
            .pipe(gulp.dest('dist'))
    });
    gulp.task(
        'compile',
        gulp.series(gulp.parallel('compile-with-lib'))
    );
    runTask('compile')
}