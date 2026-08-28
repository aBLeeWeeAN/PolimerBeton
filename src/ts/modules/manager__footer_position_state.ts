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

    // 3. event #3
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
