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

    // ! вычисления ставятся на паузу когда hero уйдёт из области видимости
    const observer = new IntersectionObserver(([entry]) => {
        isInView = entry.isIntersecting
    })
    observer.observe(hero)

    // * функция параллакса
    const updateParallax = () => {
        if (!isInView) {
            ticking = false
            return
        }

        const rect = hero.getBoundingClientRect()
        const windowHeight = window.innerHeight

        // * cчитаем прогресс прохождения секции через вьюпорт (от 0 до 1)
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height)
        const clampedProgress = Math.min(Math.max(progress, 0), 1)

        // * интерполируем от -35% до 35% (как в CSS @keyframes)
        const currentPercent = -35 + clampedProgress * 70

        heroBgWrapper.style.transform = `translate3d(0, ${currentPercent}%, 0)`
        ticking = false
    }

    // * листенер на скролл
    window.addEventListener(
        'scroll',
        () => {
            if (!ticking && isInView) {
                window.requestAnimationFrame(updateParallax)
                ticking = true
            }
        },
        { passive: true },
    )
}
