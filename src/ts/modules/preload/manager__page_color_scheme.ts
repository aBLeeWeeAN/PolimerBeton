const updateVisuals = (theme: string) => {
    const isLight = theme === 'light'
    const opacityVal = isLight ? '0' : '1'
    const invOpacityVal = isLight ? '1' : '0'

    const moon = document.getElementById('My-Moon-Svg-Icon')
    const moonMobile = document.getElementById('My-Moon-Svg-Icon--Mobile')
    const sun = document.getElementById('My-Sun-Svg-Icon')
    const sunMobile = document.getElementById('My-Sun-Svg-Icon--Mobile')

    if (moon) {
        moon.style.opacity = opacityVal
    }
    if (moonMobile) {
        moonMobile.style.opacity = opacityVal
    }
    if (sun) {
        sun.style.opacity = invOpacityVal
    }
    if (sunMobile) {
        sunMobile.style.opacity = invOpacityVal
    }
}

export async function initColorSchemeManager() {
    const getSystemTheme = (): string =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    // ! --- ЧАСТЬ 1: МГНОВЕННАЯ (Синхронно красим страницу до рендеринга DOM) ---
    const storedTheme = localStorage.getItem('theme')
    const activeTheme = storedTheme || getSystemTheme()

    // Устанавливаем тему на html немедленно. Никакого FOUC и белых вспышек!
    document.documentElement.setAttribute('data-theme', activeTheme)
    document.documentElement.setAttribute('data-bs-theme', activeTheme)

    // !--- ЧАСТЬ 2: ОТЛОЖЕННАЯ (Безопасно ждем DOM для настройки кнопок и иконок) ---
    const setupUIListeners = async () => {
        const toggleTheme = document.getElementById('My-Toggle-Color-Scheme-Button')
        const toggleThemeMobile = document.getElementById('My-Toggle-Color-Scheme-Button--Mobile')
        const resetTheme = document.getElementById('My-Reset-Color-Scheme-Button')
        const resetThemeMobile = document.getElementById('My-Reset-Color-Scheme-Button--Mobile')

        if (!toggleTheme && !toggleThemeMobile) {
            return
        }

        updateVisuals(activeTheme)

        const handleThemeChange = (targetTheme: string) => {
            document.documentElement.setAttribute('data-theme', targetTheme)
            document.documentElement.setAttribute('data-bs-theme', targetTheme)
            updateVisuals(targetTheme)
            localStorage.setItem('theme', targetTheme)
        }

        const toggleHandler = () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light'
            handleThemeChange(current === 'light' ? 'dark' : 'light')
        }

        const resetHandler = () => {
            localStorage.removeItem('theme')
            handleThemeChange(getSystemTheme())
        }

        toggleTheme?.addEventListener('click', toggleHandler)
        toggleThemeMobile?.addEventListener('click', toggleHandler)
        resetTheme?.addEventListener('click', resetHandler)
        resetThemeMobile?.addEventListener('click', resetHandler)
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupUIListeners)
    } else {
        setupUIListeners()
    }

    // ! --- ЧАСТЬ 3: ГЛОБАЛЬНАЯ (Отслеживание системных изменений темы) ---
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (!localStorage.getItem('theme')) {
            const systemTheme = getSystemTheme()
            document.documentElement.setAttribute('data-theme', systemTheme)
            document.documentElement.setAttribute('data-bs-theme', systemTheme)
            updateVisuals(systemTheme)
        }
    })
}
