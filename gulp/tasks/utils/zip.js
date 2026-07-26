import fs from 'fs'

import gulp from 'gulp'
import gulpZip from 'gulp-zip'
import through2 from 'through2'
import { deleteAsync } from 'del'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'

// * --- EXPORT GULP TASK FOR PUSH PROJECT BUILD TO ZIP ARCHIVE
// * ----------------------------------------------------------
export async function zip() {
    // ошибка если папки `./dist` нету
    if (!fs.existsSync(path.build.base)) {
        // eslint-disable-next-line no-console
        console.error(
            '\n\x1b[31m%s\x1b[0m\n',
            `❌ Error: Build directory "${path.build.base}" does not exist. Run "gulp prod" or "gulp dev" first.`,
        )
        process.exit(1) // Ломаем процесс с кодом ошибки, чтобы дальнейший пайплайн не выполнялся
    }

    // удаляем старый архив
    await deleteAsync(`${path.zip}/${path.projectRootFolderName}.zip`)

    // основной пайплайн
    return gulp
        .src(`${path.build.base}/**/*.*`, { encoding: false })
        .pipe(
            env.buildMode.isDev
                ? plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.ZIP)
                : through2.obj(), // passthrough
        )
        .pipe(gulpZip(`${path.projectRootFolderName}.zip`))
        .pipe(gulp.dest(`${path.zip}/`))
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('zip', zip)
