import $ from 'jquery'

export function initOffcanvasPaddingTop() {
    const $topNavbar = $('.fixed-top-navbar')
    const $offcanvas = $('.offcanvas')

    // Защита: если на этой странице нет шапки или меню-оффканваса,
    // скрипт не будет тратить ресурсы и вешать событие resize
    if (!$topNavbar.length || !$offcanvas.length) {
        return
    }

    const updateOffcanvasPaddingTop = () => {
        // Округляем вверх до целого числа
        const topNavbarHeight = Math.ceil($topNavbar.outerHeight() || 0)
        $offcanvas.css('padding-top', `${topNavbarHeight}px`)
    }

    // Первоначальный расчет при вызове функции
    updateOffcanvasPaddingTop()

    // Перерасчет при изменении размеров экрана
    $(window).on('resize', updateOffcanvasPaddingTop)
}
