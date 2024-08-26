$(document).ready(function () {
    function update_offcanvas_body_height() {
        if (document.documentElement.clientWidth < 576) {
            var top_navbar_height = $('.fixed-top-navbar').outerHeight();
            $('.offcanvas-body').css('height', (window.innerHeight - top_navbar_height) + 'px');
            // $('.offcanvas-body').css('max-height', (window.innerHeight - top_navbar_height) + 'px');
        } else {
            $('.offcanvas-body').css('height', 'auto');
        }
      }

    update_offcanvas_body_height(); // Initial calculation
    $(window).resize(update_offcanvas_body_height); // Recalculate on resize
});