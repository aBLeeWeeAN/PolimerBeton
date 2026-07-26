import $ from 'jquery'

export function initHeroMarginTop() {
    const $topNavbar = $('.fixed-top-navbar')
    const $heroContainer = $('#Hero-Container')

    // Защита: если мы находимся на странице, где нет шапки или героя,
    // то просто выходим и не тратим ресурсы браузера
    if (!$topNavbar.length || !$heroContainer.length) {
        return
    }

    const updateHeroContainerMarginTop = () => {
        const topNavbarHeight = $topNavbar.outerHeight() || 0
        $heroContainer.css('margin-top', `${topNavbarHeight}px`)
    }

    // Первоначальный расчет при загрузке
    updateHeroContainerMarginTop()

    // Вешаем перерасчет при изменении размеров экрана
    $(window).on('resize', updateHeroContainerMarginTop)
}
