const GA_ID = 'G-XSZP3WXDN6'
const YANDEX_ID = 98233807

export function initCookieConsentBannerManager() {
    const cookieConsentBanner = document.getElementById('my-cookie-consent-banner')
    const cookieConsentButtons = document.querySelectorAll<HTMLButtonElement>(
        '.my-default-button--cookie-consent-banner',
    )
    const footerCookieSettingsButtons = document.querySelectorAll<HTMLButtonElement>(
        '.my-js-cookie-settings-btn',
    )

    // ? Проверяем только то, без чего баннер физически не работает
    if (!cookieConsentBanner || cookieConsentButtons.length === 0) {
        return
    }

    if (cookieConsentBanner.dataset.initialized === 'true') {
        return
    }
    cookieConsentBanner.dataset.initialized = 'true'

    // ? dummy guard
    cookieConsentBanner.classList.add('d-none')
    cookieConsentBanner.classList.remove('show')

    // * --- STORAGE UTILS
    // * -----------------
    const getCookie = (name: string): string | undefined => {
        const matches = document.cookie.match(
            new RegExp(
                // eslint-disable-next-line no-useless-escape
                '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)',
            ),
        )
        return matches ? decodeURIComponent(matches[1]) : undefined
    }

    const setConsentCookie = (value: boolean): void => {
        const maxAge = 60 * 60 * 24 * 365 // ? 1 year
        const isSecure = window.location.protocol === 'https:' ? '; Secure' : ''

        document.cookie = `analytical_cookies_accepted=${value}; max-age=${maxAge}; path=/; SameSite=Lax${isSecure}`
    }

    const purgeAnalyticsData = (): void => {
        if (GA_ID) {
            ;(window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true
        }

        const hostname = window.location.hostname
        const mainDomain = hostname.startsWith('www.') ? hostname.slice(4) : hostname

        document.cookie.split(';').forEach((cookie) => {
            const name = cookie.split('=')[0].trim()
            if (name.startsWith('_ym') || name.startsWith('_ga')) {
                const expires = 'Thu, 01 Jan 1970 00:00:00 UTC'
                document.cookie = `${name}=; expires=${expires}; path=/;`
                document.cookie = `${name}=; expires=${expires}; path=/; domain=${hostname}`
                document.cookie = `${name}=; expires=${expires}; path=/; domain=.${mainDomain}`
            }
        })

        const clearStorage = (storage: Storage) => {
            Object.keys(storage).forEach((key) => {
                if (key.startsWith('_ym') || key.startsWith('_ga') || key.startsWith('ym_')) {
                    storage.removeItem(key)
                }
            })
        }

        clearStorage(localStorage)
        clearStorage(sessionStorage)
    }

    // * --- INJECT COOKIES
    // * ------------------
    const injectAnalyticsScripts = (): void => {
        if (document.head.dataset.analyticsInjected === 'true') {
            return
        }
        document.head.dataset.analyticsInjected = 'true'

        if (GA_ID) {
            // ? сброс блокировки GA
            delete (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`]

            const scriptGaSrc = document.createElement('script')
            scriptGaSrc.async = true
            scriptGaSrc.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
            document.head.appendChild(scriptGaSrc)

            const scriptGaConfig = document.createElement('script')
            scriptGaConfig.text = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
            `
            document.head.appendChild(scriptGaConfig)
        }

        if (YANDEX_ID) {
            const scriptYandex = document.createElement('script')
            scriptYandex.type = 'text/javascript'
            scriptYandex.text = `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${YANDEX_ID}, "init", { webvisor: true, clickmap: true, accurateTrackBounce: true, trackLinks: true });
        `
            document.head.appendChild(scriptYandex)
        }
    }

    // * --- MANAGE BANNER
    // * -----------------
    const hideBanner = (): void => {
        cookieConsentBanner.classList.remove('show')
        setTimeout(() => {
            cookieConsentBanner.classList.add('d-none')
        }, 300)
    }

    const showBanner = (): void => {
        cookieConsentBanner.classList.remove('d-none')
        void cookieConsentBanner.offsetHeight // ? reflow
        cookieConsentBanner.classList.add('show')
    }

    // * --- LISTENERS
    // * -------------
    // 1. Кнопки внутри баннера
    cookieConsentButtons.forEach((button) => {
        button.addEventListener('click', () => {
            hideBanner()

            const isAccepted =
                button.id === 'cookie-accept-btn' || button.dataset.action === 'accept'

            if (isAccepted) {
                setConsentCookie(true)
                injectAnalyticsScripts()
            } else {
                const wereScriptsInjected = document.head.dataset.analyticsInjected === 'true'

                setConsentCookie(false)
                purgeAnalyticsData()

                // ? Перезагружаем только если скрипты уже были внедрены в текущей сессии
                if (wereScriptsInjected) {
                    window.location.reload()
                }
            }
        })
    })

    // 2. Кнопки в футере
    footerCookieSettingsButtons.forEach((button) => {
        button.addEventListener('click', () => {
            showBanner()

            // Фокус на ссылку в баннере | Первая в DOM
            // const firstFocusable = cookieConsentBanner.querySelector<HTMLElement>('a[href], button')
            // firstFocusable?.focus()

            // Переносим фокус на первую кнопку баннера для удобства клавиатурной навигации
            const firstBtn = cookieConsentBanner.querySelector<HTMLButtonElement>('button')
            firstBtn?.focus()
        })
    })

    // * --- START LOGIC
    // * ---------------
    const consentValue = getCookie('analytical_cookies_accepted')

    if (consentValue === 'true') {
        injectAnalyticsScripts()
        return
    }

    if (consentValue === 'false') {
        purgeAnalyticsData()
        return
    }

    // * --- SHOW BANNER IF USER HASN'T CHOSEN YET
    // * ----------------------------------------
    purgeAnalyticsData()
    showBanner()
}
