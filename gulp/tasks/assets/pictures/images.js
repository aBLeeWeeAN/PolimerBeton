// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE: ASSISTED BY DEEPSEEK & GOOGLE AI
// ! Logic verified by output results. Maintained by aLeeTheY.
// ! ------------------------------------------------------------
/* eslint-disable no-console */

import gulp from 'gulp'
import nodePath from 'path'
import through2 from 'through2'
import browserSync from 'browser-sync'

import { env } from '../../../config/env.js'
import { path } from '../../../config/path.js'
import {
    notify,
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../../helpers/error-handler.js'
import { assetFamilyExists } from '../../../helpers/asset-exists.js'

// import Vinyl from 'vinyl'
import sharp from 'sharp'
// import sharpOptimizeImages from 'gulp-sharp-optimize-images'

// * --- GOOGLE RESPONSIVE BREAKPOINTS (WIDTHS)
// * -----------------------------------------
const BREAKPOINTS = {
    original: null, // Флаг для обработки оригинального размера
    // desktop: 1440,
    // laptop: 1024,
    // tablet: 768,
    // mobile: 320,
}

// * --- PROCESS AND OPTIMIZE WITH SHARP DIRECTLY
// * --------------------------------------------
function processAndOptimizeImages() {
    let updated = 0
    let skipped = 0
    let generatedCount = 0

    return through2.obj(
        async function (file) {
            if (file.isNull()) {
                return
            }
            if (file.isStream()) {
                this.emit('error', new Error('Streaming not supported'))
                return
            }

            const ext = file.extname.toLowerCase()
            if (ext === '.gif') {
                this.push(file)
                generatedCount++
                updated++
                return
            }

            // Определяем подпапку в dist, куда попадёт файл
            const outSubDir = nodePath.join(
                nodePath.resolve(path.build.images),
                nodePath.dirname(file.relative),
            )
            const rawBaseName = file.stem

            if (env.isVerbose) {
                console.log(`[images] checking ${file.relative}`)
            }

            try {
                if (assetFamilyExists(outSubDir, rawBaseName)) {
                    skipped++
                    if (env.isVerbose) {
                        console.log(`[images] skipping (up-to-date): ${file.relative}`)
                    }
                    return
                }

                updated++
                if (env.isVerbose) {
                    console.log(`[images] processing: ${file.relative}`)
                }

                const metadata = await sharp(file.contents).metadata()
                const originalWidth = metadata.width

                for (const [sizeName, width] of Object.entries(BREAKPOINTS)) {
                    if (width && originalWidth && originalWidth <= width) {
                        continue
                    }

                    const suffix = sizeName === 'original' ? '' : `-${sizeName}`
                    const baseName = file.stem + suffix

                    let pipeline = sharp(file.contents)
                    if (width) {
                        pipeline = pipeline.resize({ width, withoutEnlargement: true })
                    }

                    const formatsToGenerate = [
                        { ext: ext, type: ext.replace('.', '') },
                        { ext: '.webp', type: 'webp' },
                        { ext: '.avif', type: 'avif' },
                    ]

                    for (const format of formatsToGenerate) {
                        let formatPipeline = pipeline.clone()

                        if (format.type === 'jpg' || format.type === 'jpeg') {
                            formatPipeline = formatPipeline.jpeg({
                                quality: env.buildMode.isDev ? 100 : 80,
                                mozjpeg: env.buildMode.isStaging || env.buildMode.isProd,
                                progressive: true,
                            })
                        } else if (format.type === 'png') {
                            formatPipeline = formatPipeline.png({
                                effort: env.buildMode.isDev ? 1 : 10,
                                quality: env.buildMode.isDev ? 100 : 80,
                                compressionLevel: env.buildMode.isDev ? 0 : 9,
                                palette: true,
                            })
                        } else if (format.type === 'webp') {
                            formatPipeline = formatPipeline.webp({
                                effort: env.buildMode.isDev ? 0 : 6,
                                quality: env.buildMode.isDev ? 100 : 60,
                            })
                        } else if (format.type === 'avif') {
                            formatPipeline = formatPipeline.avif({
                                effort: env.buildMode.isDev ? 0 : 9,
                                quality: env.buildMode.isDev ? 100 : 50,
                                bitdepth: 8,
                            })
                        }

                        const outputBuffer = await formatPipeline.toBuffer()
                        const newFile = file.clone({ contents: false })
                        newFile.stem = baseName
                        newFile.extname = format.ext
                        newFile.contents = outputBuffer
                        this.push(newFile)
                        generatedCount++
                    }
                }
            } catch (err) {
                this.emit('error', err)
                throw err
            }
        },
        function (cb) {
            notify.success(
                NOTIFICATION_HANDLER_TITLES.IMAGES,
                `Images: ${updated} updated, ${skipped} skipped (${generatedCount} files)`,
            )
            cb()
        },
    )
}

// * --- EXPORT GULP TASK FOR IMAGES (RASTER) FILES
// * ----------------------------------------------
export function images() {
    return (
        gulp
            .src(path.src.images.files, { encoding: false })
            .pipe(
                env.buildMode.isDev
                    ? plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.IMAGES)
                    : through2.obj(), // passthrough
            )
            // * генерируем адаптивные копии (они получат суффиксы -mobile, -tablet и т.д.)
            // .pipe(generateResponsiveImages())
            // * генерируем avif/webp и оптимизируем изображения
            // .pipe(
            //     sharpOptimizeImages({
            //         // * format {from}_to_{to}
            //         jpg_to_jpg: {
            //             quality: env.buildMode.isDev ? 100 : 80,
            //             mozjpeg: env.buildMode.isStaging || env.buildMode.isProd,
            //             progressive: true,
            //         },
            //         png_to_png: {
            //             effort: env.buildMode.isDev ? 1 : 10,
            //             quality: env.buildMode.isDev ? 100 : 80,
            //             progressive: true,
            //             compressionLevel: env.buildMode.isDev ? 0 : 9,
            //         },
            //         webp: {
            //             effort: env.buildMode.isDev ? 0 : 6,
            //             quality: env.buildMode.isDev ? 100 : 60,
            //             // lossless: true,
            //             // nearLossless: true,
            //         },
            //         avif: {
            //             effort: env.buildMode.isDev ? 0 : 9,
            //             quality: env.buildMode.isDev ? 100 : 50,
            //             bitdepth: 8,
            //             // lossless: false,
            //         },
            //         // gif: {},
            //     }),
            // )
            // * генерируем адаптивные размеры + конвертируем в форматы + сжимаем
            .pipe(processAndOptimizeImages())
            .pipe(gulp.dest(path.build.images))
            .on('end', () => {
                // * update dev server
                browserSync.reload()
            })
    )
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('images', images)
