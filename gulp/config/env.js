/* eslint-disable no-console */
import fs from 'fs'
import nodePath from 'node:path'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { path } from './path.js'

// * --- NODE_ENV
// * ------------
const NODE_ENV = process.env.NODE_ENV ?? 'development'

// * --- RESOLVE PATH TO PACKAGE.JSON FILE
// * -------------------------------------
const packageJsonPath = nodePath.resolve(process.cwd(), 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
const appVersion = packageJson.version

// * --- ARGV CONFIG
// * ---------------
const argv = yargs(hideBin(process.argv))
    // * Разрешаем yargs автоматически превращать кебаб-регистр (--site-folder) в camelCase (argv.siteFolder)
    .parserConfiguration({ 'camel-case-expansion': true })
    // * Выравнивание текста по ширине терминала
    .wrap(Math.min(100, yargs(hideBin(process.argv)).terminalWidth()))
    // * Настраиваем вывод версии приложения
    .version('workspace-version', 'Displays current workspace semantic version', appVersion)
    .alias('workspace-version', ['wv', 'W'])
    // * Настраиваем вывод help
    .help('info', 'Displays CLI options manual')
    .alias('info', 'i')
    // * Флаг verbose
    .option('verbose', {
        alias: ['V'],
        type: 'boolean',
        default: false,
        description: 'Unlocks extended console logging during task streaming execution',
    })
    // * Флаг staging
    .option('staging', {
        alias: ['s'],
        type: 'boolean',
        default: false,
        description: 'Enable `staging` environment configurations under `production` build rules',
    })
    .option('force-clean', {
        alias: ['c'],
        type: 'boolean',
        default: false,
        description: 'Triggers a hard sweep of the compiled `dist/` workspace directory',
    })
    // * Флаг local
    .option('local', {
        alias: ['l'],
        type: 'boolean',
        default: false,
        description:
            'Switches paths to strict relative links, satisfying standalone execution via `file:///`',
    })
    // * Флаг internationalization
    .option('internationalization', {
        alias: ['i18n', 'I'],
        type: 'boolean',
        default: false,
        description: 'Activates localized multi-lingual document compilation',
    })
    // * Флаг css-mode
    .option('css-mode', {
        alias: ['cm'],
        type: 'string',
        default: 'scss',
        choices: ['css', 'scss'],
        description: 'Set styles processing mode: standard CSS or Sass/SCSS compilation',
    })
    // * Флаг js-mode
    .option('js-mode', {
        alias: ['jm'],
        type: 'string',
        default: 'ts',
        choices: ['js', 'ts'],
        description:
            'Set scripts processing mode: standard JavaScript or TypeScript (via `esbuild`)',
    })
    // * Флаг inline-sprite
    .option('inline-sprite', {
        alias: ['is'],
        type: 'boolean',
        default: false,
        description:
            'Directly embeds the SVG vector asset grid inside the document (forced automatically via `--local`)',
    })
    // * Флаг inline-css
    .option('inline-css', {
        alias: ['ic'],
        type: 'boolean',
        default: false,
        description: 'Directly embeds production stylesheets inside the HTML layout payload',
    })
    // * Флаг inline-js
    .option('inline-js', {
        alias: ['ij'],
        type: 'boolean',
        default: false,
        description: 'Directly embeds processed client scripts inside the HTML layout payload',
    })
    // * Флаг mobile-first
    .option('mobile-first', {
        alias: ['mf', 'M'],
        type: 'boolean',
        default: false,
        description:
            'Toggles the build layout pipeline. Sets PostCSS media query sorting to `mobile-first` and configures the HTML picture transformer to generate `min-width` source tags instead of `max-width`',
    })
    // * Флаг obfuscation
    .option('obfuscation', {
        alias: ['obf', 'o'],
        type: 'boolean',
        default: false,
        description:
            'Obfuscates structural CSS class selectors across HTML, CSS, and JS. Incompatible with `--inline-*` options',
    })
    // * Флаг domain
    .option('domain', {
        alias: ['site-url', 'url', 'd'],
        type: 'string',
        default: undefined,
        defaultDescription: 'http://localhost:3000',
        description: 'Maps target deployment domain root, e.g., `https://example.com`',
    })
    // * Флаг site-folder
    .option('site-folder', {
        alias: ['folder', 'sf', 'F'],
        type: 'string',
        default: undefined,
        defaultDescription: '/',
        description:
            'Folder name on the hosting server or GitHub repository name (e.g., `my-repo`, `www`, ...)',
    })
    // * Флаг production-server
    .option('prod-server', {
        alias: ['server', 'ps', 'P'],
        type: 'boolean',
        default: false,
        description: 'Launches a local server tracking the compiled production build footprint',
    })
    // * Флаг secure
    .option('secure', {
        alias: ['use-https', 'https', 'H'],
        type: 'boolean',
        default: false,
        description:
            'Forces HTTPS protocol execution for both build paths and local development servers',
    })
    // * Флаг gh-pages
    .option('gh-pages', {
        alias: ['demo', 'gh', 'g'],
        type: 'boolean',
        default: false,
        description:
            'Enable GitHub Pages build configuration (uses GitHub URLs, see `site.config.json` in `src/`)',
    })

    // ! group options
    .group(['obfuscation'], 'EXPERIMENTAL OPTIONS (USE WITH CAUTION):')

    // ! check options mix
    .check((argv) => {
        // Получаем имя запущенной таски Gulp (первый позиционный аргумент)
        const gulpTask = argv._[0]

        // 1. Production environment rules (если запустили таску 'prod' в девелопменте)
        if (NODE_ENV === 'production' && gulpTask === 'dev') {
            throw new Error('Cannot run development tasks in NODE_ENV=production mode.')
        }

        // 2. Development environment rules (если запустили 'prod' или '--staging' в девелопменте)
        if (NODE_ENV === 'development' && (gulpTask === 'prod' || argv.staging)) {
            throw new Error('Cannot run production/staging tasks in NODE_ENV=development mode.')
        }

        // 3. Explicit staging rule (Safety measure)
        if (argv.staging && NODE_ENV !== 'production') {
            throw new Error('The --staging flag is only available in production environment.')
        }

        // 4. Obfuscation safety check
        if (
            argv.obfuscation &&
            (argv['inline-sprite'] || argv['inline-css'] || argv['inline-js'])
        ) {
            throw new Error('--obfuscation and --inline-* flags cannot be used together.')
        }

        return true
    })
    .fail((msg, err) => {
        // * Выводим трейс ошибки (err.stack), если упал JS код, а не yargs валидация
        console.error('\n\x1b[31m%s\x1b[0m\n', `❌ Error: ${msg || err.stack || err.message}`)
        process.exit(1)
    })
    .parse()

// * --- CHECK ENVIRONMENT TYPE
// * --------------------------
const isStagingMode = NODE_ENV === 'production' && argv.staging
const isLocalFileMode = argv.local || false
const isGitHubPages = argv.ghPages || false

// * --- LOAD CONFIG
// * ---------------
const siteConfig = JSON.parse(fs.readFileSync(`${path.src.base}/site.config.json`, 'utf-8'))

// * --- BUILD SITE_URL & ASSET_PREFIX PATHS
// * ---------------------------------------
const sitePaths = (() => {
    // 1. Автономный режим (file:///) — полностью зануляет url
    // ! siteUrl и assetPrefix не используется когда активен `--local`
    // ! каждый ресурс (script, html и т.д.) перестраивает пути относительно себя сам
    if (isLocalFileMode) {
        return { siteUrl: '', assetPrefix: '' }
    }

    // 2. Вытягиваем домен сайта по окружению (если в JSON пусто — берем дефолт 'https://localhost:3000')
    let domain
    if (argv.domain !== undefined) {
        domain = argv.domain
    } else if (argv.staging || argv.prodServer) {
        // Если тестируем стейджинг или запускаем локальный прод-сервер — строго localhost
        domain = siteConfig.domain || 'https://localhost:3000'
    } else if (isGitHubPages) {
        domain = siteConfig.domainGitHubPages || ''
    } else if (NODE_ENV === 'production') {
        domain = siteConfig.domainProduction || ''
    } else {
        domain = siteConfig.domain || 'https://localhost:3000'
    }

    // 3. Вытягиваем папку сайта по окружению (если в JSON пусто — берем дефолт '/')
    let folder
    if (argv.siteFolder !== undefined) {
        folder = argv.siteFolder
    } else if (argv.staging || argv.prodServer) {
        // localhost обычно поднимается в корне, поэтому сбрасываем папку на '/'
        folder = siteConfig.siteFolder || '/'
    } else if (isGitHubPages) {
        folder = siteConfig.siteFolderGitHubPages || ''
    } else if (NODE_ENV === 'production') {
        folder = siteConfig.siteFolderProduction || ''
    } else {
        folder = siteConfig.siteFolder || '/'
    }

    // 4.1. Зачистка от лишних пробелов и слэшей (защита от дурака)
    let cleanDomain = domain.trim().replace(/\/$/, '')

    // ! ЗАЩИТА: Проверяем, что домен не пустой, перед тем как мучить его регулярками
    if (cleanDomain) {
        // 4.2. Вытаскиваем протокол, если он был указан в строке домена
        const match = cleanDomain.match(/^(https?):\/\//)
        const protocolInDomain = match ? match[1] : null

        // 4.3 Если в домене был протокол, берем его за основу. Если нет — смотрим на флаг --secure
        const targetProtocol = protocolInDomain || (argv.secure ? 'https' : 'http')

        // 4.4. Очищаем домен от протокола
        cleanDomain = cleanDomain.replace(/^https?:\/\//, '')

        // 4.5. Если юзер передал флаг --secure, но в домене написано http:// — тогда ругаемся и перезаписываем
        if (argv.secure && protocolInDomain === 'http') {
            console.warn(
                `\x1b[33m⚠️ Warning: --domain has http:// but --secure flag forces https://. Overriding to https.\x1b[0m`,
            )
            cleanDomain = `https://${cleanDomain}`
        } else {
            cleanDomain = `${targetProtocol}://${cleanDomain}`
        }
    }

    const cleanFolder = folder.trim().replace(/^\/|\/$/g, '')

    // 5. Формируем ASSET PREFIX (пути для картинок/стилей без домена)
    // Если мы в --local (все пусто) или домен забыли указать — префикс пустой
    // Если папки нет (корень) — префикс '/', если есть — '/папка/'
    const assetPrefix = !cleanDomain && !cleanFolder ? '' : cleanFolder ? `/${cleanFolder}/` : '/'

    // 6. Формируем полный URL для SEO (с доменом, без слэша на конце)
    const siteUrl = (() => {
        // Если домен в итоге пустой (мало ли что в конфиге напутали) — отдаем пустую строку
        if (!cleanDomain) {
            return ''
        }

        // Если папки нет (или это был просто корень '/') — отдаем только чистый домен
        if (!cleanFolder) {
            return cleanDomain
        }

        // Склеиваем домен и папку через один красивый слэш
        return `${cleanDomain}/${cleanFolder}`
    })()

    return { siteUrl, assetPrefix }
})()

// * --- EXPORT GULP ENV
// * -------------------
export const env = {
    buildMode: {
        isDev: NODE_ENV === 'development',
        isStaging: isStagingMode,
        isProd: NODE_ENV === 'production' && !isStagingMode,
    },

    isVerbose: argv.verbose,
    isForceClean: argv.forceClean,
    isLocal: isLocalFileMode,
    isI18N: argv.internationalization,

    cssMode: argv.cssMode,
    jsMode: argv.jsMode,

    isInlineSprite: argv.inlineSprite || isLocalFileMode, // local подразумевает инлайн-спрайт
    isInlineCSS: argv.inlineCss,
    isInlineJS: argv.inlineJs,

    isMobileFirst: argv.mobileFirst,
    isObfuscation: argv.obfuscation,

    // ! Result must be like that: `https://example.com` or `https://example.com/site-folder`
    siteUrl: sitePaths.siteUrl,

    // ! Префикс для ассетов, если не --local, то он будет absolute ('/')
    // ! Если был задан siteFolder, то он будет ('/site-folder/')
    assetPrefix: sitePaths.assetPrefix,

    isProdServer: argv.prodServer,
    isHttps: argv.secure,

    // TODO: доделать режим сборки под Django
    // isDjangoBuild: argv.djangoBuild,

    // placeholders: {
    //     webpInCssPolyfillScript: fs.readFileSync('node_modules/webp-in-css/polyfill.js', 'utf-8'),
    // },
}
