import fs from 'fs'
import gulp from 'gulp'
import nodePath from 'path'
import gulpIf from 'gulp-if'
import through2 from 'through2'
import { deleteAsync } from 'del'
import prettier from 'gulp-prettier'
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

// ! posthtml so bad...
// import posthtml from 'gulp-posthtml'
// import loadConfig from 'posthtml-load-config'
// import include from 'posthtml-include'

import gulpReplace from 'gulp-replace'

import htmlmin from 'gulp-html-minifier-terser'

// import webphtml from 'gulp-webp-html-nosvg' // TODO: deprecated
// import webphtml from 'gulp-webp-html-fixed' // ! no avig support

// import { pictureTransformer } from '../../helpers/picture-transformer.js'
// import avifWebpHtml from 'gulp-avif-webp-html-universal'

// TODO:
// * --- CACHE VERSION
// * -----------------
// const cacheVersion = `?v=${Date.now()}`

// TODO: доделать <source> для video, audio и 'hreflang' i18n
function createHtmlStream({
    siteUrl,
    allAvailableLocales,
    defaultLocale,
    currentLocale,
    jsonLocaleData,
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

    // ! формируем итоговый prefix для ассетов
    const pathPrefix = env.isLocal
        ? currentLocale !== defaultLocale
            ? '../'
            : './'
        : env.assetPrefix
    // console.log(`ASSET_PREFIX: ${env.assetPrefix}`)

    // ? кастомный фильтр для проверки, что объект это массив
    const nunjucksManageEnvironment = function (environment) {
        environment.addFilter('isArray', function (obj) {
            return Array.isArray(obj)
        })
    }

    return (
        gulp
            // * берем исходники
            .src([path.src.njk, path.src.html])
            // * подключаем plumber, чтобы gulp не падал при ошибке
            .pipe(plumberWithErrorHandler(NOTIFICATION_HANDLER_TITLES.HTML))
            // * собираем все partials в полноценные html
            // .pipe(
            //     fileInclude({
            //         prefix: '@@',
            //         basepath: '@file',
            //         context: {
            //             placeholder__webpInCssPolyfill: `<script>\n${webpInCssPolyfillScript}\n</script>`,
            //         },
            //     }),
            // )
            // .pipe(posthtml())
            .pipe(
                nunjucksRender({
                    // path: [`${path.projectRootFolderName}/src/`, `${path.projectRootFolderName}/src/templates/`, `${path.projectRootFolderName}/`],
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
                        siteUrl,
                        currentLocale,
                        defaultLocale,
                        allAvailableLocales,
                        ...jsonLocaleData,
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
            // .pipe(
            //     // nunjucksRender({
            //     //     path: ['src/partials'], // CRITICAL: Tell Nunjucks where to find header/footer
            //     // }),
            //     nunjucksCompile(),
            // )

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

            // TODO: доделать это дерьмо
            // * замена ссылок между страницами сайта
            .pipe(gulpReplace(/@page\//g), `${currentLocale !== undefined ? currentLocale : ''}/`)

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
    // * инлайн-ресурсы (загружаем один раз)
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

    if (env.isI18N) {
        // * build for locales
        const i18nConfig = JSON.parse(
            fs.readFileSync(`${path.src.i18n.base}/languages.json`, 'utf-8'),
        )
        const { default_locale: defaultLocale, available_locales: locales } = i18nConfig

        for (const currentLocale of locales) {
            const dataPath = `${path.src.i18n.base}/${currentLocale}.json`
            const jsonLocaleData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

            const destPathByLocale =
                currentLocale === defaultLocale
                    ? path.build.html
                    : nodePath.join(path.build.html, String(currentLocale).toLowerCase())

            const stream = createHtmlStream({
                siteUrl: env.siteUrl,
                allAvailableLocales: locales,
                defaultLocale,
                currentLocale,
                jsonLocaleData,
                destPathByLocale,
                cssContent,
                jsContent,
                spriteContent,
            })
            await new Promise((resolve, reject) => {
                stream.on('end', resolve).on('error', reject)
            })

            // reload browserSync after every locale build
            // browserSync.reload();
        }
    } else {
        const stream = createHtmlStream({
            destPathByLocale: path.build.html,
            cssContent,
            jsContent,
            spriteContent,
        })

        await new Promise((resolve, reject) => {
            stream.on('end', resolve).on('error', reject)
        })
    }

    // * update dev server
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
