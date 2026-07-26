import gulp from 'gulp'
import through2 from 'through2'
import gulpReplace from 'gulp-replace'
import browserSync from 'browser-sync'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'

// * --- PROCESSING WEBMANIFEST
// * --------------------------
function metaWebManifest() {
    return gulp
        .src(path.src.meta.favicon.webManifest)
        .pipe(
            env.buildMode.isDev
                ? plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.META.FAVICON.WEB_MANIFEST)
                : through2.obj(), // passthrough
        )
        .pipe(gulpReplace(/\/?@meta\//g, env.assetPrefix))
        .pipe(gulp.dest(path.build.meta))
        .on('end', () => {
            // * update dev server
            browserSync.reload()
        })
}

// * --- FAVICON COPY
// * ----------------
function metaFavicon() {
    return gulp
        .src(path.src.meta.favicon.images, { encoding: false })
        .pipe(
            env.buildMode.isDev
                ? plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.META.FAVICON.IMAGES)
                : through2.obj(), // passthrough
        )
        .pipe(gulp.dest(path.build.meta))
        .on('end', () => {
            // * update dev server
            browserSync.reload()
        })
}

// * --- TEXT META FILES COPY
// * ------------------------
function metaText() {
    // const formattedDate = new Intl.DateTimeFormat('en-US', {
    //     month: '2-digit',
    //     day: '2-digit',
    //     year: 'numeric',
    // })
    //     .format(new Date())
    //     .replace(/\//g, '-')

    // ! Date like that: yyyy-mm-dd
    const formattedDate = new Date().toISOString().split('T')[0]

    return gulp
        .src(path.src.meta.text)
        .pipe(
            env.buildMode.isDev
                ? plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.META.TEXT)
                : through2.obj(), // passthrough
        )
        .pipe(gulpReplace(/@meta__site-url/g, env.siteUrl))
        .pipe(gulpReplace(/@meta__date/g, formattedDate))
        .pipe(gulp.dest(path.build.meta))
        .on('end', () => {
            // * update dev server
            browserSync.reload()
        })
}

// * --- EXPORT GULP TASK FOR META FILES
// * -----------------------------------
export const meta = gulp.parallel(metaWebManifest, metaFavicon, metaText)

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('meta', meta)
