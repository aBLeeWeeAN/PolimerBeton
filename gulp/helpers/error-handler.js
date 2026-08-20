/* eslint-disable no-console */
import toasted from 'toasted-notifier'
import plumber from 'gulp-plumber'

import { env } from '../config/env.js'

// * --- EXPORT HANDLER TITLES
// * -------------------------
export const NOTIFICATION_HANDLER_TITLES = {
    UNKNOWN: 'UNKNOWN',
    HTML: 'HTML',
    META: {
        FAVICON: {
            IMAGES: 'META -> FAVICON -> IMAGES',
            WEB_MANIFEST: 'META -> FAVICON -> WEB_MANIFEST',
        },
        TEXT: 'META -> TEXT',
    },
    STYLES: 'STYLES',
    SCRIPTS: 'SCRIPTS',
    AUDIO: 'AUDIO',
    ICONS: 'ICONS',
    IMAGES: 'IMAGES',
    VIDEOS: 'VIDEOS',
    FONTS: 'FONTS',
    I18N: 'I18N',
    MISC: 'MISC',
    LIBS: 'LIBS',
    CRITICAL_CSS: 'CRITICAL CSS',
    ZIP: 'ZIP',
    FTP: 'FTP',
    REVISION: {
        DEFAULT: 'REVISION',
        REWRITE: 'REVISION -> REWRITE',
    },
    OBFUSCATE_SELECTORS: 'OBFUSCATE SELECTORS',
}

// * --- EXPORT NOTIFY HELPERS
// * -------------------------
export const notify = {
    warn(title, message) {
        // Вывод в консоль (обычный или цветной)
        console.warn(
            `[ WARNING  ] ${title ?? NOTIFICATION_HANDLER_TITLES.UNKNOWN}: ${message ?? ''}`,
        )

        if (env.isVerbose) {
            toasted.notify({
                title: `[ WARNING  ] ${title ?? NOTIFICATION_HANDLER_TITLES.UNKNOWN}`,
                message: message ?? '',
                sound: false,
                wait: false,
                // можно добавить тип: 'warning' если toasted поддерживает
            })
        }
    },
    info(title, message) {
        // Вывод в консоль (обычный или цветной)
        console.info(
            `[ INFO     ] ${title ?? NOTIFICATION_HANDLER_TITLES.UNKNOWN}: ${message ?? ''}`,
        )

        if (env.isVerbose) {
            toasted.notify({
                title: `[ INFO     ] ${title ?? NOTIFICATION_HANDLER_TITLES.UNKNOWN}`,
                message: message ?? '',
                sound: false,
                wait: false,
                // можно добавить тип: 'warning' если toasted поддерживает
            })
        }
    },
    success(title, message) {
        // Вывод в консоль (обычный или цветной)
        console.info(
            `[ SUCCESS  ] ${title ?? NOTIFICATION_HANDLER_TITLES.UNKNOWN}: ${message ?? ''}`,
        )

        if (env.isVerbose) {
            toasted.notify({
                title: `[ SUCCESS  ] ${title ?? NOTIFICATION_HANDLER_TITLES.UNKNOWN}`,
                message: message ?? '',
                sound: false,
                wait: false,
            })
        }
    },
}

// * --- EXPORT ERROR HANDLER
// * ------------------------
export const errorHandler = (title) =>
    function (err) {
        // 1. Формируем подробный текст ошибки
        const errorMessage = err.stack || err.message || err.toString()

        // Выводим в консоль
        console.error(
            `\x1b[31m[ ERROR     ] ${title ?? NOTIFICATION_HANDLER_TITLES.UNKNOWN}:\x1b[0m\n`,
            errorMessage,
        )

        // 2. Уведомление на рабочий стол (только если verbose)
        if (env.isVerbose) {
            const shortMessage = err.message || (typeof err === 'string' ? err : 'Build error')
            toasted.notify({
                title: `[ ERROR     ] ${title ?? NOTIFICATION_HANDLER_TITLES.UNKNOWN}`,
                message: shortMessage,
                sound: false,
                wait: false,
            })
        }

        // 3. Разделение поведения Dev / Prod:
        // В Dev/Watch режиме делаем emit('end'), чтобы Gulp НЕ падал и продолжал следить за файлами.
        // В Prod режиме падение НЕ гасим, чтобы кодер увидел ошибку сборки.
        if (env.buildMode.isDev) {
            this.emit('end')
        }
    }

// * --- EXPORT GULP PLUMBER WITH ERROR HANDLER
// * ------------------------------------------
export const plumberWithErrorHandler = (title) => plumber({ errorHandler: errorHandler(title) })
