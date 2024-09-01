// $(document).ready(function () {
//     function update_offcanvas_body_height() {
//         if (document.documentElement.clientWidth < 576) {
//             var top_navbar_height = $('.fixed-top-navbar').outerHeight();
//             $('.offcanvas-body').css('height', (window.innerHeight - top_navbar_height) + 'px');
//             // $('.offcanvas-body').css('max-height', (window.innerHeight - top_navbar_height) + 'px');
//         } else {
//             $('.offcanvas-body').css('height', 'auto');
//         }
//       }

//     update_offcanvas_body_height(); // Initial calculation
//     $(window).resize(update_offcanvas_body_height); // Recalculate on resize
// });

$(document).ready(function () {
    var resizeTimeout;

    function updateOffcanvasBodyHeight() {
        if (document.documentElement.clientWidth < 576) {
            var topNavbarHeight = $('.fixed-top-navbar').outerHeight();
            $('.offcanvas-body').css('height', (window.innerHeight - topNavbarHeight) + 'px');
        } else {
            $('.offcanvas-body').css('height', 'auto');
        }
    }

    // Дебаунсер для обработчика resize
    function debounce(func, wait) {
        return function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(func, wait);
        };
    }

    // Определяем медиа-запрос для ширины экрана менее 576px
    var mediaQuery = window.matchMedia('(max-width: 575.98px)');

    function handleMediaQueryChange(e) {
        if (e.matches) {
            updateOffcanvasBodyHeight();
        } else {
            $('.offcanvas-body').css('height', 'auto');
        }
    }

    // Инициализируем обработку медиа-запроса
    handleMediaQueryChange(mediaQuery);

    // Добавляем обработчик для изменений медиа-запроса
    mediaQuery.addListener(handleMediaQueryChange);

    // Используем дебаунсинг для обработки изменения размера окна
    $(window).on('resize', debounce(function () {
        handleMediaQueryChange(mediaQuery);
    }, 200)); // 200 мс - время ожидания для дебаунсинга

    // Пересчитываем высоту при загрузке страницы
    updateOffcanvasBodyHeight();
});