import fs from 'fs'
import gulp from 'gulp'
import nodePath from 'path'
import fastGlob from 'fast-glob'
import { pathToFileURL } from 'url'
import browserSync from 'browser-sync'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import { notify, NOTIFICATION_HANDLER_TITLES } from '../../helpers/error-handler.js'

import penthouse from 'penthouse'
// import puppeteer from 'puppeteer'

// * --- EXPORT GULP TASK FOR INLINE CRITICAL CSS TO HTML FILES
// * ----------------------------------------------------------
export async function criticalCss() {
    // ! use system Google Chrome browser
    process.env.PUPPETEER_EXECUTABLE_PATH =
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

    if (env.isInlineCSS) {
        notify.info(
            NOTIFICATION_HANDLER_TITLES.CRITICAL_CSS,
            'Skipped – full inline CSS is enabled.',
        )
        return
    }

    const dir = nodePath.resolve(path.build.html)
    const cssFilePath = nodePath.resolve(path.build.styles, 'main.min.css')

    // const files = fs.readdirSync(dir)
    // const htmlFiles = files.filter((f) => f.endsWith('.html'))

    const htmlFiles = fastGlob.sync('**/*.html', {
        cwd: dir,
        absolute: true,
    })

    // ! не нужно, penthouse захватывает media queries при генерации благодаря postcss-sort-media-queries
    // const viewports = [
    //     { width: 375, height: 667 }, // Mobile
    //     { width: 1920, height: 1080 }, // Desktop
    // ]

    const viewport = {
        width: 1920,
        height: 1080,
    }

    for (const filePath of htmlFiles) {
        let html = fs.readFileSync(filePath, 'utf-8')

        if (
            !html.includes('<!-- ! DO NOT REMOVE THIS COMMENT !!! | CRITICAL CSS PLACEHOLDER --->')
        ) {
            continue
        }

        try {
            const fileUrl = pathToFileURL(filePath).href
            const criticalCss = await penthouse({
                url: fileUrl,
                css: cssFilePath,
                width: viewport.width,
                height: viewport.height,

                // ! INCLUDE SOME CSS CLASSES TO PENTHOUSE MANUALLY !!!
                forceInclude: [/^\.avif #reeding-house/, /^\.webp #reeding-house/],

                // * puppeteer settings
                // puppeteer: {
                //     executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                //     headless: 'new', // актуально для свежих версий Chrome
                //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
                // },
            })

            html = html.replace(
                '<!-- ! DO NOT REMOVE THIS COMMENT !!! | CRITICAL CSS PLACEHOLDER --->',
                `<style type="text/css" id="critical-css">${criticalCss}</style>`,
            )

            fs.writeFileSync(filePath, html)
        } catch (err) {
            notify.warn(
                NOTIFICATION_HANDLER_TITLES.CRITICAL_CSS,
                `${nodePath.basename(filePath)}: ${err.message}`,
            )
        }

        // * update dev server
        browserSync.reload()
    }
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('critical-css', criticalCss)
