import gulp from 'gulp'
import through2 from 'through2'
import browserSync from 'browser-sync'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'

// * --- EXPORT GULP TASK FOR (JS/TS) LIBS FILES
// * -------------------------------------------
export function libs() {
    return gulp
        .src(path.src.libs)
        .pipe(
            env.buildMode.isDev
                ? plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.LIBS)
                : through2.obj(), // passthrough
        )
        .pipe(gulp.dest(path.build.libs))
        .on('end', () => {
            // * update dev server
            browserSync.reload()
        })
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('libs', libs)
