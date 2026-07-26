import fs from 'fs'

import gulp from 'gulp'
import through2 from 'through2'
import vinylFTP from 'vinyl-ftp'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import { configFTP } from '../../config/ftp.js'
import {
    notify,
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'

// * --- EXPORT GULP TASK FOR UPLOAD PROJECT BUILD TO REMOTE SERVER VIA FTP PROTOCOL
// * -------------------------------------------------------------------------------
export function ftp() {
    // ! 1. КРИТИЧЕСКАЯ ПРОВЕРКА: Существует ли папка сборки и есть ли в ней файлы
    if (!fs.existsSync(path.build.base) || fs.readdirSync(path.build.base).length === 0) {
        // eslint-disable-next-line no-console
        console.error(
            '\n\x1b[31m%s\x1b[0m\n',
            `❌ Error: Build directory "${path.build.base}" is missing or empty. Run "gulp prod" before deploying.`,
        )
        process.exit(1)
    }

    // ! 2. Проверка доступов FTP
    if (!configFTP.host || !configFTP.user) {
        notify.warn(NOTIFICATION_HANDLER_TITLES.FTP, 'FTP credentials missing, skipping deploy.')

        // ! иначе создаётся пустая папка в корне проекта
        const emptyStream = through2.obj()
        emptyStream.end()

        return emptyStream
    }

    configFTP.log = (message) => {
        // * vinyl-ftp передаёт строку вида "PUT /path"
        notify.info(NOTIFICATION_HANDLER_TITLES.FTP, message)
    }

    const ftpConnect = vinylFTP.create(configFTP)
    const remotePath = env.siteFolder ? `/${env.siteFolder}` : '/'

    return gulp
        .src(`${path.build.base}/**/*.*`, {})
        .pipe(
            env.buildMode.isDev
                ? plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.FTP)
                : through2.obj(), // passthrough
        )
        .pipe(ftpConnect.dest(remotePath))
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('ftp', ftp)
