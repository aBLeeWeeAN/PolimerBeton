export async function initFooterPositionStateManager() {
    const footer = document.getElementById('footer')

    if (!footer) {
        return
    }

    // ! если юзер отключил анимации -> запретить инициализацию vanilla-tilt
    // todo: можно сделать через listener, а не как init-вариант
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        footer.style.setProperty('--footer__fade__opacity', '0')
        footer.classList.add('my-footer--relative')

        return
    }

    const updateFooterState = () => {
        // ? получаем текущую высоту footer
        const footerHeight = footer.offsetHeight
        // document.documentElement.style.setProperty('--my-footer-height', `${footerHeight}px`)

        const isOverflowing = footerHeight >= window.innerHeight
        footer.classList.toggle('my-footer--relative', isOverflowing)

        // * --- FADE EFFECT при скролле
        // ? получаем полную высоту всего документа
        const scrollHeight = document.documentElement.scrollHeight

        // ? высота viewport
        const clientHeight = window.innerHeight

        // ? получаем число пикселей, сколько проскроллено от начала страницы
        const scrollTop = window.scrollY || document.documentElement.scrollTop

        // ? вычисляем расстояние до конца страницы
        const distanceToBottom = scrollHeight - (scrollTop + clientHeight)

        if (footerHeight > 0) {
            // ? рассчитываем процент открытия футера | от 0 (закрыт) до 1 (открыт)
            const rawProgress = 1 - distanceToBottom / footerHeight

            // ? обрезаем rawProgress чётко по диапазону 0 и 1 | на случай если юзер ещё не доскроллил до футера (rawProgress будет отрицательным)
            const progress = Math.min(Math.max(rawProgress, 0), 1)

            // ? вычисляем текущее значение opacity (для footer::after) до 2 знаков после запятой
            const afterOpacity = (1 - progress).toFixed(2)

            // ? обновляем CSS-переменную
            footer.style.setProperty('--footer__fade__opacity', afterOpacity)
        }
    }

    // 1. event #1
    const observer = new ResizeObserver(updateFooterState)
    observer.observe(footer)

    // 2. event #2
    window.addEventListener('scroll', updateFooterState, { passive: true })

    // 3. event #3
    window.addEventListener('resize', updateFooterState, { passive: true })

    // 4. event #4
    footer.addEventListener('focusin', () => {
        // * домотать scrollbar до конца, если на любом ребенке footer есть focus state
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        })
    })

    // last step
    updateFooterState()
}
