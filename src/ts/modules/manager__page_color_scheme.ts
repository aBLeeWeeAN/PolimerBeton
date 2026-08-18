// Функция для ожидания полной загрузки картинки
function waitForImageLoad(img: HTMLImageElement | null): Promise<void> {
    return new Promise((resolve) => {
        if (!img || img.complete) {
            resolve()
        } else {
            img.onload = () => resolve()
            img.onerror = () => resolve()
        }
    })
}

// Главная функция инициализации темы
export async function initColorScheme() {
    // --- ЧАСТЬ 1: МГНОВЕННАЯ (Синхронно красим страницу до рендеринга DOM) ---
    const getSystemTheme = (): string =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    const storedTheme = localStorage.getItem('theme')
    const activeTheme = storedTheme || getSystemTheme()

    // Устанавливаем тему на html немедленно. Никакого FOUC и белых вспышек!
    document.documentElement.setAttribute('data-theme', activeTheme)
    document.documentElement.setAttribute('data-bs-theme', activeTheme)

    // --- ЧАСТЬ 2: ОТЛОЖЕННАЯ (Безопасно ждем DOM для настройки кнопок и иконок) ---
    const setupUIListeners = async () => {
        const toggleTheme = document.getElementById(
            'My-Toggle-Color-Scheme-Button',
        ) as HTMLInputElement | null
        const toggleThemeMobile = document.getElementById(
            'My-Toggle-Color-Scheme-Button--Mobile',
        ) as HTMLInputElement | null
        const resetToSystemTheme = document.getElementById(
            'My-Reset-Color-Scheme-Button',
        ) as HTMLInputElement | null
        const resetToSystemThemeMobile = document.getElementById(
            'My-Reset-Color-Scheme-Button--Mobile',
        ) as HTMLInputElement | null

        const moonIcon = document.getElementById('My-Moon-Svg-Icon') as SVGSVGElement | null
        const moonIconMobile = document.getElementById(
            'My-Moon-Svg-Icon--Mobile',
        ) as SVGSVGElement | null
        const sunIcon = document.getElementById('My-Sun-Svg-Icon') as SVGSVGElement | null
        const sunIconMobile = document.getElementById(
            'My-Sun-Svg-Icon--Mobile',
        ) as SVGSVGElement | null
        // const heroForegroundImage = document.getElementById(
        //     'hero-fr-img',
        // ) as HTMLImageElement | null

        // Мягкая защита: если на странице вообще нет переключателей темы — тихо выходим, не ломая JS
        if (!toggleTheme && !toggleThemeMobile) {
            return
        }

        // Функция обновления прозрачности иконок и картинок
        const updateVisuals = (theme: string) => {
            if (moonIcon) {
                moonIcon.style.opacity = theme === 'light' ? '0' : '1'
            }
            if (moonIconMobile) {
                moonIconMobile.style.opacity = theme === 'light' ? '0' : '1'
            }
            if (sunIcon) {
                sunIcon.style.opacity = theme === 'light' ? '1' : '0'
            }
            if (sunIconMobile) {
                sunIconMobile.style.opacity = theme === 'light' ? '1' : '0'
            }

            // if (heroForegroundImage) {
            //     heroForegroundImage.style.opacity = theme === 'light' ? '0.3' : '0.1'
            // }
        }

        // Если картинка есть, ждем её загрузки, но это больше не блокирует саму тему!
        // if (heroForegroundImage) {
        //     await waitForImageLoad(heroForegroundImage)
        // }

        // Синхронизируем состояние иконок под уже примененную тему
        updateVisuals(activeTheme)

        // Единый обработчик смены темы
        const handleThemeChange = (targetTheme: string) => {
            document.documentElement.setAttribute('data-theme', targetTheme)
            document.documentElement.setAttribute('data-bs-theme', targetTheme)
            updateVisuals(targetTheme)
            localStorage.setItem('theme', targetTheme)
        }

        // Навешиваем события (безопасный оператор опциональной последовательности `?.`)
        toggleTheme?.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light'
            handleThemeChange(current === 'light' ? 'dark' : 'light')
        })

        toggleThemeMobile?.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light'
            handleThemeChange(current === 'light' ? 'dark' : 'light')
        })

        resetToSystemTheme?.addEventListener('click', () => {
            localStorage.removeItem('theme')
            handleThemeChange(getSystemTheme())
        })

        resetToSystemThemeMobile?.addEventListener('click', () => {
            localStorage.removeItem('theme')
            handleThemeChange(getSystemTheme())
        })
    }

    // Запускаем привязку событий в зависимости от состояния DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupUIListeners)
    } else {
        setupUIListeners()
    }

    // --- ЧАСТЬ 3: ГЛОБАЛЬНАЯ (Отслеживание системных изменений темы) ---
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (!localStorage.getItem('theme')) {
            const systemTheme = getSystemTheme()
            document.documentElement.setAttribute('data-theme', systemTheme)
            document.documentElement.setAttribute('data-bs-theme', systemTheme)

            // Если DOM к этому моменту готов, мягко обновляем иконки «на лету»
            const moon = document.getElementById('My-Moon-Svg-Icon')
            if (moon) {
                const moonMobile = document.getElementById('My-Moon-Svg-Icon--Mobile')
                const sun = document.getElementById('My-Sun-Svg-Icon')
                const sunMobile = document.getElementById('My-Sun-Svg-Icon--Mobile')
                // const heroImg = document.getElementById('hero-fr-img')

                if (moon) {
                    moon.style.opacity = systemTheme === 'light' ? '0' : '1'
                }
                if (moonMobile) {
                    moonMobile.style.opacity = systemTheme === 'light' ? '0' : '1'
                }
                if (sun) {
                    sun.style.opacity = systemTheme === 'light' ? '1' : '0'
                }
                if (sunMobile) {
                    sunMobile.style.opacity = systemTheme === 'light' ? '1' : '0'
                }
                // if (heroImg) {
                //     heroImg.style.opacity = systemTheme === 'light' ? '0.3' : '0.1'
                // }
            }
        }
    })
}
