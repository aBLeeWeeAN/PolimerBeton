export function initCookieConsentBanner() {
    // * берем id элементов
    const cookieBanner = document.getElementById('my-cookie-consent-banner')
    const cookieBanner__buttons = document.querySelectorAll<HTMLButtonElement>(
        '.my-cookie-consent-banner__button',
    )
    const containerForCookies = document.getElementById('my-third-party-cookies-container')

    // Защита: document.querySelectorAll никогда не возвращает null (он возвращает пустой NodeList).
    // Поэтому проверяем коллекцию через .length. Если элементов нет — тихо выходим.
    if (!cookieBanner || !containerForCookies || cookieBanner__buttons.length === 0) {
        return
    }

    // Фиксируем типы для TypeScript, чтобы убрать 'possibly null' во вложенных функциях
    const box: HTMLElement = cookieBanner
    const container: HTMLElement = containerForCookies

    // ! защита от дурака | добавляем класс d-none
    // ! и удаляем класс .show, если он каким-то образом установлен раньше времени
    // ! анимацию не ждём !!!
    box.classList.add('d-none') // bootstrap class d-none
    box.classList.remove('show')

    // * --- COOKIES SCRIPTS
    // * -------------------
    // Яндекс.Метрика
    const yandexMetrikaScript = `
        (function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
            m[i].l = 1 * new Date();
            for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
            }
            (k = e.createElement(t)), (a = e.getElementsByTagName(t)[0]), (k.async = 1), (k.src = r), a.parentNode.insertBefore(k, a);
        })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(98233807, "init", { webvisor: true, clickmap: true, accurateTrackBounce: true, trackLinks: true });
    `

    const yandexMetrikaNoscript = `
        <div><img src="https://mc.yandex.ru/watch/98233807" style="position:absolute; left:-9999px;" alt="" /></div>
    `

    // Google Analytics
    const googleAnalyticsScript_main = `
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag("js", new Date());
        gtag("config", "G-XSZP3WXDN6");
    `

    // * --- SERVICE FUNCTIONS
    // * ---------------------
    // Функция для динамического добавления скриптов
    const injectAnalyticsScripts = (): void => {
        // Добавляем Яндекс.Метрику
        const scriptYandex = document.createElement('script')
        scriptYandex.type = 'text/javascript'
        scriptYandex.innerHTML = yandexMetrikaScript
        scriptYandex.async = true
        container.appendChild(scriptYandex)

        // Добавляем Google Analytics (основной загрузчик)
        const scriptGoogle_gTag = document.createElement('script')
        scriptGoogle_gTag.type = 'text/javascript'
        scriptGoogle_gTag.src = 'https://www.googletagmanager.com/gtag/js?id=G-XSZP3WXDN6'
        scriptGoogle_gTag.async = false
        scriptGoogle_gTag.defer = true
        container.appendChild(scriptGoogle_gTag)

        // Добавляем конфигурацию Google Analytics
        const scriptGoogle_main = document.createElement('script')
        scriptGoogle_main.type = 'text/javascript'
        scriptGoogle_main.innerHTML = googleAnalyticsScript_main
        scriptGoogle_main.async = false
        scriptGoogle_main.defer = true
        container.appendChild(scriptGoogle_main)

        // Добавляем noscript для Яндекс.Метрики
        const noscript = document.createElement('noscript')
        noscript.innerHTML = yandexMetrikaNoscript
        container.appendChild(noscript)

        // Скрываем контейнер скриптов
        container.style.display = 'none'
    }

    const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift()
        }
    }

    const deleteCookie = (name: string): void => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }

    const hasYandexCookies = (): boolean => {
        const cookies = document.cookie.split('; ')
        return cookies.some((cookie) => cookie.startsWith('_ym'))
    }

    const deleteYandexCookies = (): void => {
        const cookies = document.cookie.split('; ')
        cookies.forEach((cookie) => {
            const [name] = cookie.split('=')
            if (name.startsWith('_ym')) {
                deleteCookie(name)
            }
        })
    }

    // * --- MAIN FUNCTION
    // * -----------------
    const executeCodes = (): void => {
        const analyticalCookiesValue = getCookie('analytical_cookies_accepted')

        // 1. Если куки приняты — заряжаем скрипты и выходим
        if (analyticalCookiesValue === 'true') {
            injectAnalyticsScripts()
            return
        }

        // 2. Если куки отклонены — просто выходим (без всяких else)
        if (analyticalCookiesValue === 'false') {
            return
        }

        // 3. Код ниже выполнится ТОЛЬКО если куки еще не устанавливались (бывший блок else).
        if (hasYandexCookies()) {
            deleteYandexCookies()
        }

        // Показываем баннер
        box.classList.remove('d-none') // bootstrap class d-none

        // ! браузер принудительно перерисует страницу и только потом добавит .show
        void box.offsetHeight

        // setTimeout(() => {
        box.classList.add('show')
        // }, 1000)

        cookieBanner__buttons.forEach((button) => {
            button.addEventListener('click', () => {
                // если нажали одну из кнопок - скрываем баннер
                box.classList.remove('show')
                setTimeout(() => {
                    // * ждём завершения анимации + 50ms запаса
                    box.classList.add('d-none') // bootstrap class d-none
                }, 300 + 50)

                // пользователь согласился на куки
                if (button.id === 'cookie-accept-btn') {
                    document.cookie =
                        'analytical_cookies_accepted=true; max-age=' +
                        60 * 60 * 24 * 30 +
                        '; path=/'
                    injectAnalyticsScripts()
                    return
                }

                // пользователь отказался от куки
                document.cookie =
                    'analytical_cookies_accepted=false; max-age=' + 60 * 60 * 24 * 30 + '; path=/'
            })
        })
    }

    // * --- ENTRY POINT
    // * ---------------
    executeCodes()
}
