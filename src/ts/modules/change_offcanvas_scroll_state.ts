export function initOffcanvasScrollState() {
    const header = document.querySelector('.my-header__fixed-part') as HTMLElement | null
    const offcanvas = document.getElementById('offcanvasNavbar') as HTMLElement | null
    const navMenu = offcanvas?.querySelector('.my-nav-menu') as HTMLElement | null

    if (!header || !offcanvas || !navMenu) {
        return
    }

    let lastScrollTop = window.scrollY || window.pageYOffset
    let offcanvasIsShown = false
    let isScrollLocked = false
    let scrollPosition = 0

    const SCROLL_THRESHOLD = 16
    const TOP_EDGE_BUFFER = 50

    // Название BEM-класса для скрытия шапки (обязательно совпадает с SCSS)
    const HIDDEN_CLASS = 'my-header__fixed-part--hidden'

    const preventTouchScroll = (e: TouchEvent) => {
        if (navMenu.contains(e.target as Node)) {
            return
        }
        if (e.cancelable) {
            e.preventDefault()
        }
    }

    const lockScroll = () => {
        if (isScrollLocked) {
            return
        }

        scrollPosition = window.scrollY || window.pageYOffset
        document.documentElement.style.scrollBehavior = 'auto'

        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollPosition}px`
        document.body.style.width = '100%'
        document.body.style.overflowY = 'hidden'

        document.body.addEventListener('touchmove', preventTouchScroll, { passive: false })
        isScrollLocked = true
    }

    const unlockScroll = () => {
        if (!isScrollLocked) {
            return
        }

        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflowY = ''

        window.scrollTo(0, scrollPosition)
        document.documentElement.style.scrollBehavior = ''

        document.body.removeEventListener('touchmove', preventTouchScroll)
        isScrollLocked = false

        lastScrollTop = scrollPosition
    }

    const updateScrollState = () => {
        if (document.documentElement.clientWidth >= 576) {
            unlockScroll()
            return
        }

        // Исправлено для линтера (no-unused-expressions)
        if (offcanvasIsShown) {
            lockScroll()
        } else {
            unlockScroll()
        }
    }

    // ====== События Offcanvas ======
    offcanvas.addEventListener('show.bs.offcanvas', () => {
        offcanvasIsShown = true
        // Принудительно показываем шапку при открытии меню
        header.classList.remove(HIDDEN_CLASS)
        updateScrollState()
    })

    offcanvas.addEventListener('hidden.bs.offcanvas', () => {
        offcanvasIsShown = false
        updateScrollState()
    })

    window.addEventListener('resize', updateScrollState)
    window.addEventListener('orientationchange', updateScrollState)

    // ====== Header hide/show на скролл ======
    let ticking = false

    window.addEventListener(
        'scroll',
        () => {
            if (offcanvasIsShown || isScrollLocked) {
                return
            }

            const isBootstrapAnimatingOrOpen =
                offcanvas.classList.contains('show') ||
                offcanvas.classList.contains('showing') ||
                offcanvas.classList.contains('hiding')

            if (isBootstrapAnimatingOrOpen) {
                header.classList.remove(HIDDEN_CLASS)
                return
            }

            const scrollTop = window.scrollY || window.pageYOffset

            if (Math.abs(scrollTop - lastScrollTop) < SCROLL_THRESHOLD) {
                return
            }

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Условие 1: Скроллим вниз И ушли ниже безопасной зоны -> прячем
                    if (scrollTop > lastScrollTop && scrollTop > TOP_EDGE_BUFFER) {
                        header.classList.add(HIDDEN_CLASS)
                    }
                    // Условие 2: Скроллим вверх ИЛИ у самого верха -> показываем
                    else {
                        header.classList.remove(HIDDEN_CLASS)
                    }

                    lastScrollTop = scrollTop
                    ticking = false
                })
                ticking = true
            }
        },
        { passive: true },
    )
}
