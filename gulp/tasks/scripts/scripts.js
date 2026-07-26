import gulp from 'gulp'
import through2 from 'through2'
// import gulpIf from 'gulp-if'
// import gulpRev from 'gulp-rev'
import gulpRename from 'gulp-rename'
import browserSync from 'browser-sync'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'

// ! build mode
import { gulpEsbuild } from 'gulp-esbuild'

// ! watch mode
// import { createGulpEsbuild } from 'gulp-esbuild'
// const gulpEsbuild = createGulpEsbuild({ incremental: true })

// * --- EXPORT GULP TASK FOR JS/TS FILES
// * ------------------------------------
export function scripts() {
    return (
        gulp
            // * берем исходники
            // .src(path.src.getScripts(env.jsMode), { sourcemaps: env.buildMode.isDev || env.buildMode.isStaging })
            .src(path.src.getScripts(env.jsMode))
            // * подключаем plumber, чтобы gulp не падал при ошибке
            // ! .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.SCRIPTS))
            .pipe(
                env.buildMode.isDev
                    ? plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.SCRIPTS)
                    : through2.obj(), // passthrough
            )
            // * чекаем чё пришло на вход
            // .pipe(
            //     through2.obj(function (file, enc, cb) {
            //         console.log('🚀 GULP НАШЕЛ ФАЙЛ:', file.relative)
            //         cb(null, file)
            //     }),
            // )
            // * билдим JS с помощью Esbuild
            .pipe(
                gulpEsbuild({
                    bundle: true,
                    format: 'esm',
                    platform: 'browser',
                    entryPoints: path.src.getScripts(env.jsMode),
                    // ! файл не один
                    // outfile: 'main.min.js',
                    // * сохранить в корень выходной папки
                    outdir: '.',
                    sourcemap: env.buildMode.isDev || env.buildMode.isStaging ? 'linked' : false,
                    minify: env.buildMode.isStaging || env.buildMode.isProd,
                    target: ['es2018'],
                    drop: env.buildMode.isProd ? ['console', 'debugger'] : [],
                    treeShaking: true,
                    define: {
                        'process.env.buildMode.NODE_ENV': JSON.stringify(
                            env.buildMode.isDev ? 'development' : 'production',
                        ),
                    },
                }),
            )
            // // * добавляем к файлу ревизию для инвалидации кэша
            // .pipe(gulpIf(env.buildMode.isStaging || env.buildMode.isProd, gulpRev()))
            // * добавляем к имени суффикс .min
            .pipe(gulpRename({ suffix: '.min' }))
            // * кладем результат в папку сборки
            // ! .pipe(
            // !     gulp.dest(path.build.scripts, {
            // !         sourcemaps: env.buildMode.isDev || env.buildMode.isStaging ? '.' : false,
            // !     }),
            // ! )
            .pipe(gulp.dest(path.build.scripts))
            // // * делаем запись в rev-manifest.json
            // .pipe(
            //     gulpIf(
            //         env.buildMode.isStaging || env.buildMode.isProd,
            //         gulpRev.manifest('rev-manifest.json', { base: 'out/', merge: true }),
            //     ),
            // )
            // // * созраняем rev-manifest.json
            // .pipe(
            //     gulpIf(env.buildMode.isStaging || env.buildMode.isProd, gulp.dest(path.build.base)),
            // )
            // * обновляем сервер разработки
            .on('end', () => {
                // * update dev server
                browserSync.reload()
            })
    )
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('scripts', scripts)
