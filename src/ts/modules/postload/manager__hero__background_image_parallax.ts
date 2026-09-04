export function initHeroBackgroundImageParallaxManager() {
    // ! если юзер отключил анимации -> запретить инициализацию vanilla-tilt
    // todo: можно сделать через listener, а не как init-вариант
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const hero = document.querySelector('.my-hero') as HTMLElement | null
    const heroBgWrapper = document.querySelector('.my-hero__bg-wrapper') as HTMLElement | null

    if (!hero || !heroBgWrapper) {
        return
    }

    let ticking = false
    let isInView = false

    // Кэшируем параметры, которые не меняются при скролле
    let heroTop = 0
    let heroHeight = 0
    let windowHeight = 0

    // Функция пересчёта кэша (вызывается при изменении размеров/раскладки)
    const updateMetrics = () => {
        const rect = hero.getBoundingClientRect()
        windowHeight = window.innerHeight
        heroHeight = rect.height
        heroTop = rect.top + window.scrollY
    }

    // * функция параллакса
    const updateParallax = () => {
        if (!isInView) {
            ticking = false
            return
        }

        const scrollY = window.scrollY

        // * cчитаем прогресс прохождения секции через вьюпорт (от 0 до 1)
        const progress = (scrollY + windowHeight - heroTop) / (windowHeight + heroHeight)
        const clampedProgress = Math.min(Math.max(progress, 0), 1)

        // * интерполируем от -35% до 35% (как в CSS @keyframes)
        const currentPercent = (-35 + clampedProgress * 70).toFixed(3)

        heroBgWrapper.style.transform = `translate3d(0, ${currentPercent}%, 0)`
        ticking = false
    }

    // ! вычисления ставятся на паузу когда hero уйдёт из области видимости
    const observer = new IntersectionObserver(([entry]) => {
        isInView = entry.isIntersecting

        if (isInView) {
            updateMetrics()
            updateParallax()
        }
    })
    observer.observe(hero)

    let resizeTimer: number
    const handleResize = () => {
        window.clearTimeout(resizeTimer)
        resizeTimer = window.setTimeout(() => {
            if (isInView) {
                updateMetrics()
                updateParallax()
            }
        }, 150)
    }

    const handleOrientationChange = () => {
        if (isInView) {
            updateMetrics()
            updateParallax()
        }
    }

    const handleScroll = () => {
        if (!ticking && isInView) {
            window.requestAnimationFrame(updateParallax)
            ticking = true
        }
    }

    // * Пересчёт метрик при изменении размеров окна и ориентации
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true })

    // * Основной листенер на скролл
    window.addEventListener('scroll', handleScroll, { passive: true })

    // * первичный расчёт метрик
    updateMetrics()

    return () => {
        observer.disconnect()
        window.removeEventListener('scroll', handleScroll)

        window.removeEventListener('orientationchange', handleOrientationChange)
        window.removeEventListener('resize', handleResize)

        window.clearTimeout(resizeTimer)
    }
}
