export function initOffcanvasScrollStateManager() {
    const SCROLL_THRESHOLD = 16
    const TOP_EDGE_BUFFER = 50
    const HIDDEN_CLASS = 'my-header__fixed-part--hidden'
    const NO_SCROLL_BREAKPOINT_VW_WIDTH = 768

    const header = document.querySelector('.my-header__fixed-part') as HTMLElement | null
    const offcanvas = document.getElementById('My-Offcanvas') as HTMLElement | null
    const navMenu = offcanvas?.querySelector('.my-nav-menu') as HTMLElement | null

    if (!header || !offcanvas || !navMenu) {
        return
    }

    let lastScrollTop = window.scrollY
    let offcanvasIsShown = false
    let ticking = false

    // ? ширина главного скроллбара страницы
    // const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth

    const lockScroll = () => {
        document.documentElement.classList.add('my-noscroll-y')
    }

    const unlockScroll = () => {
        document.documentElement.classList.remove('my-noscroll-y')
    }

    const updateScrollState = () => {
        if (window.innerWidth >= NO_SCROLL_BREAKPOINT_VW_WIDTH) {
            unlockScroll()
            return
        }

        if (offcanvasIsShown) {
            lockScroll()
        } else {
            unlockScroll()
        }
    }

    const handleShow = () => {
        offcanvasIsShown = true
        header.classList.remove(HIDDEN_CLASS)
        updateScrollState()
    }

    const handleHide = () => {
        offcanvasIsShown = false
        updateScrollState()
    }

    const handleScroll = () => {
        if (offcanvasIsShown) {
            return
        }

        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY

                if (Math.abs(scrollTop - lastScrollTop) >= SCROLL_THRESHOLD) {
                    if (scrollTop > lastScrollTop && scrollTop > TOP_EDGE_BUFFER) {
                        header.classList.add(HIDDEN_CLASS)
                    } else {
                        header.classList.remove(HIDDEN_CLASS)
                    }
                    lastScrollTop = scrollTop
                }

                ticking = false
            })

            ticking = true
        }
    }

    // ? вешаем листенеры
    offcanvas.addEventListener('show.bs.offcanvas', handleShow)
    offcanvas.addEventListener('hidden.bs.offcanvas', handleHide)

    window.addEventListener('resize', updateScrollState)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // ? функция очистки
    return () => {
        offcanvas.removeEventListener('show.bs.offcanvas', handleShow)
        offcanvas.removeEventListener('hidden.bs.offcanvas', handleHide)

        window.removeEventListener('resize', updateScrollState)
        window.removeEventListener('scroll', handleScroll)

        unlockScroll()
    }
}
