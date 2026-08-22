import gulp from 'gulp'
import browserSync from 'browser-sync'

import { env } from '../../../config/env.js'
import { path } from '../../../config/path.js'

// TODO: починить watchers
// * --- EXPORT GULP TASK FOR START DEV SERVER
// * -----------------------------------------
export function server(cb) {
    browserSync.init({
        // * serve files from the app directory with directory listing
        server: {
            baseDir: path.build.html,
            directory: false,
        },
        // * control `http` or `https` mode
        https: env.isHttps,
        // ? ghost mode | enabled by default
        // ghostMode: {
        //     clicks: false,
        //     scroll: false,
        //     forms: false,
        // },
        // ? online mode
        // online: false,
        // * open localhost url
        open: 'local',
        // * open page in google chrome by default
        browser: 'chrome',
        // * hide notification in browser
        notify: false,
        // * server port
        port: 3000,
        // * задержка при вызове reload в 500 мс
        reloadDelay: 500,
        // * красивые пути в строке браузера
        middleware: [
            function (req, res, next) {
                // Честно разделяем URL на чистый путь и строку параметров (query string)
                const [urlPath, queryString] = req.url.split('?')

                // Если запрос не к корню и в самом ПУТИ нет точки (значит это не картинка, не стили и не скрипт)
                if (urlPath !== '/' && !urlPath.includes('.')) {
                    let cleanPath = urlPath

                    // Если путь заканчивается на слэш (например, /privacy/), отрезаем его
                    if (cleanPath.endsWith('/')) {
                        cleanPath = cleanPath.slice(0, -1)
                    }

                    // Собираем URL обратно: чистый путь + .html + возвращаем параметры на место (если они были)
                    req.url = cleanPath + '.html' + (queryString ? '?' + queryString : '')
                }

                next()
            },
        ],
    })
    cb()
}

// * --- REGISTER GULP TASK
// * ----------------------
gulp.task('server', server)
