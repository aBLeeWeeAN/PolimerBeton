export function initMenuButtonState() {
    const offcanvasNavbar = document.getElementById('offcanvasNavbar')
    const navbarToggler = document.getElementById('My-Hamburger-Menu-Button')

    // 1. Наша стандартная защита
    if (!offcanvasNavbar || !navbarToggler) {
        return
    }

    // 2. ФИКС ДЛЯ TYPESCRIPT:
    // Создаем новые константы и явно говорим TS: "Они ТОЧНО HTMLElement, без всяких null".
    // Так как это константы, их тип железно зафиксируется для всех вложенных функций.
    const toggler: HTMLElement = navbarToggler
    const offcanvas: HTMLElement = offcanvasNavbar

    // Функция для обновления атрибута aria-expanded
    function updateAriaExpanded(isExpanded: boolean) {
        // Теперь TS молчит, так как toggler имеет чистый тип HTMLElement
        toggler.setAttribute('aria-expanded', isExpanded ? 'true' : 'false')
    }

    // Обработчики событий
    offcanvas.addEventListener('show.bs.offcanvas', () => updateAriaExpanded(true))
    offcanvas.addEventListener('hide.bs.offcanvas', () => updateAriaExpanded(false))
}
