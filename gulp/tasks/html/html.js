import { pathToFileURL } from 'node:url'
import fs from 'fs'
import gulp from 'gulp'
import nodePath from 'path'
import gulpIf from 'gulp-if'
import through2 from 'through2'
import { deleteAsync } from 'del'
// import prettier from 'gulp-prettier'
import browserSync from 'browser-sync'

import { env } from '../../config/env.js'
import { path } from '../../config/path.js'
import {
    notify,
    plumberWithErrorHandler,
    NOTIFICATION_HANDLER_TITLES,
} from '../../helpers/error-handler.js'
import { inlineAssetsInHtml } from '../../helpers/inline-assets.js'
import { htmlImg2PictureTransformer } from '../../helpers/html-img2picture-transformer.js'

// * html plugins
// import { nunjucksCompile } from 'gulp-nunjucks'
import nunjucksRender from 'gulp-nunjucks-render'

// import fileInclude from 'gulp-file-include'
// import nunjucksRender from 'gulp-nunjucks-render'

import posthtml from 'gulp-posthtml'
// import PHLoadConfig from 'posthtml-load-config'

// ! posthtml-include so bad...
// import include from 'posthtml-include'

import gulpReplace from 'gulp-replace'

import htmlmin from 'gulp-html-minifier-terser'

// import webphtml from 'gulp-webp-html-nosvg' // TODO: deprecated
// import webphtml from 'gulp-webp-html-fixed' // ! no avig support

// import { pictureTransformer } from '../../helpers/picture-transformer.js'
// import avifWebpHtml from 'gulp-avif-webp-html-universal'

// * --- CACHE VERSION
// * -----------------
// const cacheVersion = `?v=${Date.now()}`

// TODO: доделать <source> для video, audio
function createHtmlStream({
    posthtmlPlugins = [],
    posthtmlOptions = {},
    baseWebsiteUrl,
    i18n = {},
    localeDataFromJSON = {},
    destPathByLocale,
    // * инлайн аргументы
    cssContent = '',
    jsContent = '',
    spriteContent = '',
}) {
    const ignoreCustomComments = [/Built with love by aLeeTheY/]
    if (!env.isInlineCSS) {
        ignoreCustomComments.push(/CRITICAL CSS PLACEHOLDER/)
    }

    // ! сегмент URL (например "" для дефолтного или "en" для английского)
    const urlSegment = (i18n.current?.url || '').trim().replace(/^\/|\/$/g, '')

    // ! итоговый prefix для ассетов | относительные пути для `--local` сборки: если подпапка — поднимаемся на уровень выше
    const pathPrefix = env.isLocal ? (urlSegment !== '' ? '../' : './') : env.assetPrefix

    // ? кастомные фильтры
    const nunjucksManageEnvironment = function (environment) {
        // * фильтр для выброса ошибок
        environment.addFilter('throwError', function (msg) {
            throw new Error(`\n\x1b[31m${msg}\x1b[0m\n`)
        })

        // * фильтр для проверки, что переменная это массив
        environment.addFilter('isArray', function (obj) {
            return Array.isArray(obj)
        })
    }

    // todo: можно будет добавить в env.js
    const isCleanUrl = env.isCleanUrl ?? true

    return (
        gulp
            // * берем исходники
            .src([path.src.njk, path.src.html])
            // * подключаем plumber, чтобы gulp не падал при ошибке
            .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.HTML))
            // * собираем все partials в полноценные html
            .pipe(
                nunjucksRender({
                    envOptions: {
                        throwOnUndefined: true,
                        // trimBlocks: true,
                        // lstripBlocks: true,
                    },
                    path: [
                        './',
                        './src/html/',
                        './src/html/base/',
                        './src/html/common/',
                        './src/html/components/',
                        './src/html/service/',
                        './src/html/macros/',
                    ],
                    data: {
                        base_website_url: baseWebsiteUrl,
                        i18n,
                        ...localeDataFromJSON,
                    },

                    manageEnv: nunjucksManageEnvironment,
                }),
            )
            // * генерируем <img> в <picture>/<source> + responsive + avif/webp
            .pipe(
                htmlImg2PictureTransformer(path.src.images.base, {
                    desktopFirst: !env.isMobileFirst,
                }),
            )

            // * заменяем пути на корректные для каждого ресурса
            .pipe(gulpReplace(/@meta\//g, pathPrefix))
            .pipe(gulpReplace(/@(scss|css)\//g, `${pathPrefix}css/`))
            .pipe(gulpReplace(/@(ts|js)\//g, `${pathPrefix}js/`))
            .pipe(gulpReplace(/@audio\//g, `${pathPrefix}assets/audio/`))
            // .pipe(gulpReplace(/@fonts\//g, `${pathPrefix}assets/fonts/`))
            .pipe(
                gulpReplace(/@icons\/(.+?)\.svg/g, (match, p1) => {
                    const id = p1.replace(/\//g, '--')

                    // 1. Если спрайт инлайнится в сам HTML-документ
                    if (env.isInlineSprite) {
                        return `#${id}`
                    }

                    // 2. Если спрайт лежит внешним файлом (дев, прод, github pages)
                    // assetPrefix вернет, например, '/Wishbone-plus-Partners/' или '/'
                    return `${pathPrefix}assets/icons/sprite.svg#${id}`
                }),
            )
            .pipe(gulpReplace(/@images\//g, `${pathPrefix}assets/images/`))
            .pipe(gulpReplace(/@videos\//g, `${pathPrefix}assets/videos/`))
            .pipe(gulpReplace(/@misc\//g, `${pathPrefix}assets/misc/`))
            .pipe(gulpReplace(/@libs\//g, `${pathPrefix}assets/libs/`))
            // * замена расширений файлов .scss
            .pipe(gulpReplace(/\.scss(?=["'])/g, '.min.css'))
            // * замена расширений файлов .ts
            .pipe(gulpReplace(/\.ts(?=["'])/g, '.min.js'))

            // * вставка инлайн файлов, если включена
            .pipe(
                through2.obj(function (file, enc, callback) {
                    let html = file.contents.toString()
                    html = inlineAssetsInHtml(html, {
                        inlineCss: env.isInlineCSS,
                        cssContent,
                        inlineJs: env.isInlineJS,
                        jsContent,
                        inlineSprite: env.isInlineSprite,
                        spriteContent,
                    })
                    file.contents = Buffer.from(html)
                    callback(null, file)
                }),
            )

            // * замена межстраничных ссылок @page/ -> '' или 'en/'
            .pipe(
                gulpReplace(/@page\/([a-zA-Z0-9_/-]+)\.(njk|html)/g, (match, pageName) => {
                    // ? 1. Если сборка под локальное открытие файлов (file://)
                    if (env.isLocal) {
                        const prefix = urlSegment !== '' ? '../' : './'
                        const localeSegment = urlSegment ? `${urlSegment}/` : ''

                        return `${prefix}${localeSegment}${pageName}.html`
                    }

                    // ? 2. Сборка под веб-сервер (абсолютные пути от корня сайта)
                    const basePrefix = (env.assetPrefix || '/').replace(/\/$/, '') + '/'
                    const localeSegment = urlSegment ? `${urlSegment}/` : ''

                    // * главная страница
                    if (pageName === 'index' || pageName === 'home') {
                        return `${basePrefix}${localeSegment}`
                    }

                    // * остальные страницы
                    const extension = isCleanUrl ? '' : '.html'
                    return `${basePrefix}${localeSegment}${pageName}${extension}`
                }),
            )

            // .pipe(
            //     gulpReplace(
            //         '<!-- ![GULP] DO NOT REMOVE --- plugin: webp-in-css --- polyfill.js placeholder --->',
            //         `<script>${webpInCssPolyfillScript}</script>`,
            //     ),
            // )
            // * генерируем webp на основе png, jpg, jpeg и т.д.
            // .pipe(webphtml())
            // * генерируем avif и webp на основе png, jpg и jpeg
            // .pipe(
            //     avifWebpHtml({
            //         avif: true,
            //         webp: true,
            //     }),
            // )

            // .pipe(
            //     pictureTransformer({
            //         imgDir: path.join(process.cwd(), 'out', 'assets', 'images'), // ваш путь build.images
            //         avif: true,
            //         webp: true,
            //         sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw', // пример адаптивного sizes
            //     }),
            // )
            // // * форматируем код через prettier
            // .pipe(prettier())

            // * вызываем gulp-posthtml
            .pipe(posthtml(posthtmlPlugins, posthtmlOptions))

            // * минифицируем html
            .pipe(
                gulpIf(
                    env.buildMode.isStaging || env.buildMode.isProd,
                    htmlmin({
                        caseSensitive: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        collapseBooleanAttributes: true,
                        collapseInlineTagWhitespace: false,
                        keepClosingSlash: true,
                        // * uses relateurl - see docs
                        minifyURLs: true,
                        // * uses clean-css - see docs
                        minifyCSS: true,
                        // * uses UglifyJS - see docs
                        minifyJS: env.buildMode.isProd
                            ? { compress: { drop_console: true } }
                            : true,
                        html5: true,
                        removeComments: true,
                        quoteCharacter: '"',
                        removeEmptyElements: false,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: false,
                        ignoreCustomComments: ignoreCustomComments,
                    }),
                ),
            )
            // ! posthtml so bad...
            // .pipe(posthtml())
            // * кладем результат в папку сборки
            .pipe(gulp.dest(destPathByLocale))
        // * обновляем сервер разработки
        // .pipe(browserSync.stream())
    )
}

async function buildHtml() {
    // * --- LOAD POSTHTML CONFIG
    // * ------------------------
    const configPath = pathToFileURL(nodePath.resolve('posthtml.config.js')).href
    const posthtmlConfigModule = await import(configPath)

    // ? нативная ESM-загрузка файла конфигурации
    const { plugins: posthtmlPlugins = [], options: posthtmlOptions = {} } =
        posthtmlConfigModule.default

    // * --- INLINE FILES TO HTML
    // * ------------------------
    let cssContent = ''
    let jsContent = ''
    let spriteContent = ''

    if (env.isInlineCSS) {
        const cssPath = nodePath.join(path.build.styles, 'main.min.css')
        if (fs.existsSync(cssPath)) {
            cssContent = fs.readFileSync(cssPath, 'utf-8')
        } else {
            notify.warn(NOTIFICATION_HANDLER_TITLES.HTML, 'CSS file not found for inline')
        }
    }
    if (env.isInlineJS) {
        const jsPath = nodePath.join(path.build.scripts, 'main.min.js')
        if (fs.existsSync(jsPath)) {
            jsContent = fs.readFileSync(jsPath, 'utf-8')
        } else {
            notify.warn(NOTIFICATION_HANDLER_TITLES.HTML, 'JS file not found for inline')
        }
    }
    if (env.isInlineSprite) {
        const iconsDir = nodePath.resolve(path.build.icons)
        try {
            const files = fs.readdirSync(iconsDir)
            const spriteFile = files.find((f) => /^sprite.*\.svg$/.test(f))
            if (spriteFile) {
                spriteContent = fs.readFileSync(nodePath.join(iconsDir, spriteFile), 'utf-8')
            }
        } catch (err) {
            notify.warn(
                NOTIFICATION_HANDLER_TITLES.HTML,
                `SVG sprite file not found for inline: ${err}`,
            )
        }
    }

    // * --- LOCALES (I18N)
    // * ------------------
    if (env.isI18N) {
        const i18nConfig = JSON.parse(
            fs.readFileSync(`${path.src.i18n.base}/languages.json`, 'utf-8'),
        )
        const { default_locale: defaultLocaleKey, available_locales: allAvailableLocales } =
            i18nConfig

        for (const [localeKey, localeConfig] of Object.entries(allAvailableLocales)) {
            const dataPath = `${path.src.i18n.base}/${localeKey}.json`
            const localeDataFromJSON = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

            // ! сегмент URL (например "" для дефолтного или "en" для английского)
            const urlSegment = (localeConfig.url || '').trim().replace(/^\/|\/$/g, '')
            const destPathByLocale = urlSegment
                ? nodePath.join(path.build.html, urlSegment)
                : path.build.html

            // ? собираем единый объект i18n
            const i18n = {
                currentLocale: localeKey,
                defaultLocale: defaultLocaleKey,
                current: localeConfig,
                locales: allAvailableLocales,
            }

            const stream = createHtmlStream({
                posthtmlPlugins,
                posthtmlOptions,
                baseWebsiteUrl: env.siteUrl,
                i18n,
                localeDataFromJSON,
                destPathByLocale,
                cssContent,
                jsContent,
                spriteContent,
            })

            await new Promise((resolve, reject) => {
                stream.on('end', resolve).on('error', reject)
            })
        }
    } else {
        const stream = createHtmlStream({
            posthtmlPlugins,
            posthtmlOptions,
            destPathByLocale: path.build.html,
            cssContent,
            jsContent,
            spriteContent,
        })

        await new Promise((resolve, reject) => {
            stream.on('end', resolve).on('error', reject)
        })
    }

    // * --- UPDATE DEV SERVER
    // * ---------------------
    browserSync.reload()
}

async function cleanInlineAssets() {
    // * собираем пути для удаления в массив на основе условий
    const pathsToDelete = []

    if (env.buildMode.isProd && env.isInlineCSS) {
        pathsToDelete.push(path.build.styles)
    }
    if (env.buildMode.isProd && env.isInlineJS) {
        pathsToDelete.push(path.build.scripts)
    }
    if (env.buildMode.isProd && env.isInlineSprite) {
        // pathsToDelete.push(`${path.build.icons}sprite*.svg`)
        pathsToDelete.push(path.build.icons)
    }

    // * если есть что удалять, вызываем deleteAsync и возвращаем Promise
    if (pathsToDelete.length > 0) {
        return await deleteAsync(pathsToDelete)
    }

    // * It's okay
    return Promise.resolve()
}

// * --- EXPORT GULP TASK FOR HTML FILES
// * -----------------------------------
export const html = gulp.series(buildHtml, cleanInlineAssets)

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('html', html)
