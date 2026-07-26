// ! --- ТРЕБУЕТСЯ РУЧНОЙ ЗАПУСК postcss-obfuscator, могут быть ошибки.
// ! --- Например, может заменить название ID-шников, даже если их обработка выключена
// ! ---------------------------------------------------------------------------------

import gulp from 'gulp'
import through2 from 'through2'
import nodePath from 'node:path'
import postcss from 'gulp-postcss'
import obfuscator from 'postcss-obfuscator'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import {
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'

export function obfuscateSelectors() {
    // В dev-режиме просто пропускаем
    if (env.buildMode.isDev) {
        return gulp.src('.').pipe(gulp.dest('.')) // пустой таск
    }

    const obfuscatorJsonPath = nodePath.join(path.build.styles, 'postcss-obfuscator')

    return (
        gulp
            .src(`${path.build.styles}/**/*.css`) // берём готовые CSS
            // ! .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.OBFUSCATE_SELECTORS))
            .pipe(
                env.buildMode.isStaging || env.buildMode.isProd
                    ? through2.obj()
                    : plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.OBFUSCATE_SELECTORS),
            )
            .pipe(
                postcss([
                    obfuscator({
                        enable: true,
                        length: 5,
                        classMethod: 'random',
                        classPrefix: '',
                        classSuffix: '',
                        classIgnore: [
                            // * ignored classes
                            'card--project:last-child',
                            'card--project:nth-last-child',
                        ],
                        ids: false,
                        idMethod: 'random',
                        idPrefix: '',
                        idSuffix: '',
                        idIgnore: [
                            // * ignored IDs
                            // 'header',
                            // 'header:after',
                            // 'menu-toggle:checked',
                        ],
                        formatJson: true,
                        jsonsPath: obfuscatorJsonPath,
                        srcPath: path.build.base,
                        desPath: path.build.base,
                        extensions: ['.js', '.html'],
                        // * стабильная замена для кеширования
                        fresh: env.buildMode.isDev || env.buildMode.isStaging ? false : true,
                        keepData: env.buildMode.isDev || env.buildMode.isStaging ? true : false,
                        showConfig: false,
                    }),
                ]),
            )
            .pipe(gulp.dest(path.build.styles)) // перезапишем CSS (уже с обфусцированными именами)
            .on('end', () => {
                // eslint-disable-next-line no-console
                console.log('CSS/HTML/JS class obfuscation complete')
            })
    )
}

gulp.task('obfuscate-selectors', obfuscateSelectors)

// ! --- gulp-minify-selectors не подходит, требует наличия префикса или суффикса у имён классов
// ! -------------------------------------------------------------------------------------------

// import gulp from 'gulp'
// import gulpMinifySelectors from 'gulp-minify-selectors'

// import { path } from '../../config/path.js'
// import {
//     plumberWithErrorHandler,
//     NOTIFICATION_HANDLER_TITLES,
// } from '../../helpers/error-handler.js'

// // * --- EXPORT GULP TASK FOR MINIFY CSS CLASS SELECTORS IN BUILDED HTML, CSS & JS FILES
// // * -----------------------------------------------------------------------------------
// export function minifySelectors() {
//     return gulp
//         .src([
//             `${path.build.styles}/**/*.css`,
//             `${path.build.scripts}/**/*.js`,
//             `${path.build.html}/**/*.html`,
//         ])
//         .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.MINIFY_SELECTORS))
//         .pipe(
//             gulpMinifySelectors({
//                 prefix: null,
//                 suffix: null,
//                 verbose: true,
//             }),
//         )
//         .pipe(gulp.dest(path.build.base))
// }

// // * --- REGISTER GULP TASK
// // * ----------------------
// gulp.task('minify-selectors', minifySelectors)
