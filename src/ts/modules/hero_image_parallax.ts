export function initHeroParallax() {
    const bgWrapper = document.querySelector('.my-hero__bg-wrapper') as HTMLElement | null

    // Если мы не на той странице, где есть hero-блок — просто выходим
    if (!bgWrapper) {
        return
    }

    // Переменная для хранения текущего кадра анимации
    let ticking = false

    window.addEventListener(
        'scroll',
        () => {
            if (!ticking) {
                // requestAnimationFrame синхронизирует перерисовку с частотой обновления экрана (60Hz/120Hz)
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY

                    // 0.15 — это коэффициент скорости.
                    // Чем меньше число, тем медленнее движется задник (сильнее эффект параллакса)
                    const yPos = scrolled * 0.37

                    // Двигаем через translate3d, так как это задействует видеокарту
                    bgWrapper.style.transform = `translate3d(0, ${yPos}px, 0)`

                    ticking = false
                })

                ticking = true
            }
        },
        { passive: true },
    ) // passive: true говорит браузеру, что scroll не будет отменяться, это ускоряет скролл
}
