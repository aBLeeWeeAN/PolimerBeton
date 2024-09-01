// $(document).ready(function () {
//     function update_offcanvas_padding_top() {
//         var top_navbar_height = $('.fixed-top-navbar').outerHeight();
//         $('.offcanvas').css('padding-top', top_navbar_height + 'px');
//     }

//     update_offcanvas_padding_top(); // Initial calculation
//     $(window).resize(update_offcanvas_padding_top); // Recalculate on resize
// });

$(document).ready(function () {
    var resizeTimeout;

    function updateOffcanvasPaddingTop() {
        var topNavbarHeight = $('.fixed-top-navbar').outerHeight();
        $('.offcanvas').css('padding-top', topNavbarHeight + 'px');
    }

    // Дебаунсер для обработчика resize
    function debounce(func, wait) {
        return function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(func, wait);
        };
    }

    // Пересчитываем padding-top при загрузке страницы
    updateOffcanvasPaddingTop();

    // Используем дебаунсинг для обработки изменения размера окна
    $(window).on('resize', debounce(updateOffcanvasPaddingTop, 200)); // 200 мс - время ожидания для дебаунсинга
});