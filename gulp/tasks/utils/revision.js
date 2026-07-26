import gulp from 'gulp'
import through2 from 'through2'
// import { deleteAsync } from 'del'
import { readFileSync } from 'node:fs'

import rev from 'gulp-rev'
import revRewrite from 'gulp-rev-rewrite'
import revDel from 'gulp-rev-delete-original'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'

// Проверка: не является ли имя файла уже ревизованным (содержит хеш)
const isAlreadyHashed = (file) => {
    const base = file.stem // имя без расширения
    return /-[a-f0-9]{10,}$/.test(base)
}

// * --- ASSET REVISIONING
// * ---------------------
function revision() {
    return (
        gulp
            // * берем готовые собранные ассеты
            // ! НЕ БЕРЕМ favicon.ico, robots.txt и sitemap.xml
            .src(
                `${path.build.base}/**/*.{css,js,woff,woff2,ttf,svg,avif,webp,png,jpeg,jpg,webm,mp4,mp3,webmanifest}`,
                {
                    base: path.build.base,
                    encoding: false,
                },
            )
            // * подключаем plumber
            .pipe(
                env.buildMode.isDev
                    ? plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.REVISION.DEFAULT)
                    : through2.obj(), // passthrough
            )
            // * добавляем ревизию к имени файлов
            .pipe(
                through2.obj(function (file, enc, callback) {
                    // Пропускаем уже хешированные файлы
                    if (isAlreadyHashed(file)) {
                        // Просто передаём дальше без обработки rev()
                        this.push(file)
                        return callback()
                    }
                    // Иначе обрабатываем через rev
                    const revStream = rev()
                    revStream.on('data', (f) => this.push(f))
                    revStream.on('end', callback)
                    revStream.write(file)
                    revStream.end()
                }),
            )
            // * удаляем оригинальные файлы до ревизии
            .pipe(revDel())
            // * перезаписываем файлы с новым именем
            .pipe(gulp.dest(path.build.base))
            // * генерируем rev-manifest.json
            .pipe(
                rev.manifest(`${path.build.base}/rev-manifest.json`, {
                    base: `${path.build.base}/`,
                    merge: true,
                }),
            )
            // * перезаписываем rev-manifest.json
            .pipe(gulp.dest(path.build.base))
    )
}

// * --- REWRITING REFERENCES
// * ------------------------
function rewrite() {
    const manifest = readFileSync(`${path.build.base}/rev-manifest.json`)

    return (
        gulp
            // * берем готовые собранные html
            .src(`${path.build.base}/**/*.{html,css,webmanifest}`)
            // * подключаем plumber
            .pipe(
                env.buildMode.isDev
                    ? plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.REVISION.REWRITE)
                    : through2.obj(), // passthrough
            )
            // * перезаписываем пути к новым ассетам с ревизиями
            .pipe(revRewrite({ manifest }))
            // * сохраняем обновленный html
            .pipe(gulp.dest(path.build.base))
    )
}

// * --- DELETE REVISION MANIFEST FILE
// * ---------------------------------
// deleteManifest больше не нужен, оставляем пустую функцию для совместимости
function deleteManifest(done) {
    done()
}

// function deleteManifest(done) {
//     if (env.buildMode.isProd) {
//         deleteAsync(`${path.build.base}/rev-manifest.json`).then(() => {
//             done()
//         })
//     } else {
//         done()
//     }
// }

// * --- EXPORT GULP TASK
// * --------------------
export const revise = gulp.series(revision, rewrite, deleteManifest)

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('revise', revise)
