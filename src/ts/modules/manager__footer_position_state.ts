export async function initFooterPositionStateManager() {
    const footer = document.getElementById('footer')

    if (!footer) {
        return
    }

    const updateFooterState = () => {
        const footerHeight = footer.offsetHeight
        document.documentElement.style.setProperty('--my-footer-height', `${footerHeight}px`)

        const isOverflowing = footerHeight >= window.innerHeight
        footer.classList.toggle('my-footer--relative', isOverflowing)
    }

    // 1. event #1
    const observer = new ResizeObserver(updateFooterState)
    observer.observe(footer)

    // 2. event #2
    window.addEventListener('resize', updateFooterState, { passive: true })

    // last step
    updateFooterState()
}
