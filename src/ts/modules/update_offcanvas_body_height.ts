import $ from 'jquery'

export function initOffcanvasBodyHeight() {
    const $topNavbar = $('.fixed-top-navbar')
    const $offcanvasBody = $('.offcanvas-body')

    // Защита: если на странице нет тела оффканваса, выходим
    if (!$offcanvasBody.length) {
        return
    }

    const updateOffcanvasBodyHeight = () => {
        if (document.documentElement.clientWidth < 576) {
            const topNavbarHeight = $topNavbar.outerHeight() || 0

            // Берем максимально корректную высоту видимой области
            const viewportHeight = Math.max(
                window.innerHeight,
                document.documentElement.clientHeight,
            )

            // Рассчитываем высоту и округляем вверх
            const height = Math.ceil(viewportHeight - topNavbarHeight)

            $offcanvasBody.css('height', `${height}px`)
        } else {
            $offcanvasBody.css('height', 'auto')
        }
    }

    // Первоначальный расчет при загрузке компонента
    updateOffcanvasBodyHeight()

    // Перерасчет при изменении размеров экрана и смене ориентации (актуально для мобилок)
    $(window).on('resize orientationchange', updateOffcanvasBodyHeight)
}
