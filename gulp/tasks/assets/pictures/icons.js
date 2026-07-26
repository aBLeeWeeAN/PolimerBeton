/* eslint-disable no-console */
import gulp from 'gulp'
import through2 from 'through2'
import browserSync from 'browser-sync'

import { env } from '../../../config/env.js'
import { path } from '../../../config/path.js'
import {
    notify,
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../../helpers/error-handler.js'
import { assetExists } from '../../../helpers/asset-exists.js'

import svgSprite from 'gulp-svg-sprite'
import svgoConfig from '../../../../svgo.config.mjs'

// * --- EXPORT GULP TASK FOR ICONS (SVG) FILES
// * ------------------------------------------
export async function icons() {
    // Проверяем, есть ли уже sprite.svg (или sprite-*.svg) в выходной папке
    const outDir = path.build.icons
    if (env.isVerbose) {
        console.log(`[icons] checking sprite in ${outDir}`)
    }

    const spriteExists = await assetExists(outDir, 'sprite', '.svg') // ищет sprite.svg или sprite-<hash>.svg

    if (spriteExists) {
        if (env.isVerbose) {
            console.log('[icons] sprite up‑to‑date, skipping generation')
        }
        notify.success(NOTIFICATION_HANDLER_TITLES.ICONS, 'Icons: up-to-date, skipped.')
        // Возвращаем пустой поток, чтобы Gulp не ругался
        return
    }

    if (env.isVerbose) {
        console.log('[icons] generating new sprite')
    }

    return (
        gulp
            .src(path.src.icons)
            .pipe(
                env.buildMode.isDev
                    ? plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.ICONS)
                    : through2.obj(), // passthrough
            )
            // ! use svgmin OR internal svgsprite transform, not both.
            // .pipe(svgmin())
            .pipe(
                // ! works only via web server, not via "file:///mysite.html"
                svgSprite({
                    mode: {
                        symbol: {
                            // * revision hash (disable)
                            bust: false,
                            // * sprite file name
                            sprite: '../sprite.svg',
                            // * generate html example file
                            example: false,
                            // render: {
                            //     // * generate css file with class names for icons (disable)
                            //     css: false,
                            // },
                            // * need enable if icons will using in html code
                            inline: true,
                        },
                    },
                    shape: {
                        transform: [
                            {
                                svgo: svgoConfig, // * connect svgo config
                            },
                        ],
                    },
                }),
            )
            .pipe(gulp.dest(path.build.icons))
            .on('end', () => {
                if (env.isVerbose) {
                    console.log('[icons] sprite generated successfully')
                }
                notify.success(NOTIFICATION_HANDLER_TITLES.ICONS, 'Icons: sprite generated.')

                // * update dev server
                browserSync.reload()
            })
    )
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('icons', icons)
