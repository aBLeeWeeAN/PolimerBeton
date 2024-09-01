// $(document).ready(function () {
//     function update_hero_container_margin_top() {
//         var top_navbar_height = $('.fixed-top-navbar').outerHeight();
//         $('#Hero-Container').css('margin-top', top_navbar_height + 'px');
//     }
    
//     update_hero_container_margin_top(); // Initial calculation
//     $(window).resize(update_hero_container_margin_top); // Recalculate on resize
// });

$(document).ready(function () {
    var resizeTimeout;

    function updateHeroContainerMarginTop() {
        var topNavbarHeight = $('.fixed-top-navbar').outerHeight();
        $('#Hero-Container').css('margin-top', topNavbarHeight + 'px');
    }

    // Дебаунсер для обработчика resize
    function debounce(func, wait) {
        return function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(func, wait);
        };
    }

    // Пересчитываем margin-top при загрузке страницы
    updateHeroContainerMarginTop();

    // Используем дебаунсинг для обработки изменения размера окна
    $(window).on('resize', debounce(updateHeroContainerMarginTop, 200)); // 200 мс - время ожидания для дебаунсинга
});