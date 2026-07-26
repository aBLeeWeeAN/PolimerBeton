import fs from 'fs'
import gulp from 'gulp'
import { deleteAsync } from 'del'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'

// const SCSS_FONTS_PATH = 'src/scss/base/_fonts.scss'
const SCSS_FONTS_PATH = `${path.src.getStyles(env.cssMode).base}/base/_fonts.scss`
const OFFLINE_MARKER = '// ! --- OFFLINE FONTS\n// ! -----------------'

// * --- EXPORT GULP TASK CLEAN BUILD DIRECTORY (KEEPING ASSETS)
// * -----------------------------------------------------------
export async function clean() {
    if (env.isForceClean) {
        // Полное удаление всей папки dist
        await deleteAsync([path.zip, path.build.base])

        // Очистка только офлайн-части _fonts.scss (всё после двухстрочного маркера)
        if (fs.existsSync(SCSS_FONTS_PATH)) {
            let content = fs.readFileSync(SCSS_FONTS_PATH, 'utf-8')
            const markerIndex = content.indexOf(OFFLINE_MARKER)

            if (markerIndex !== -1) {
                // Оставляем всё до конца маркера включительно
                const keepEnd = markerIndex + OFFLINE_MARKER.length
                content = content.substring(0, keepEnd).trimEnd() + '\n'
                fs.writeFileSync(SCSS_FONTS_PATH, content)
            }
        }
    } else {
        await deleteAsync([
            // * select all files in dist/ folder first
            `${path.build.base}/**`,
            // * select archive folder
            path.zip,
            // ! keep folders dist/, assets/** и libs/**
            // * keep dist/ folder
            `!${path.build.base}`,

            // * keep assets/ folder
            `!${path.build.base}/assets`,
            // * keep any folder inside assets/ folder
            `!${path.build.base}/assets/**`,

            // * keep libs/ folder
            `!${path.build.base}/libs`,
            // * keep any folder inside libs/ folder
            `!${path.build.base}/libs/**`,

            // ! keep rev-manifest.json
            `!${path.build.base}/rev-manifest.json`,
        ])
    }

    // * It's okay
    Promise.resolve()
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('clean', clean)
