$(document).ready(function () {
    function update_offcanvas_padding_top() {
        var top_navbar_height = $('.fixed-top-navbar').outerHeight();
        $('.offcanvas').css('padding-top', top_navbar_height + 'px');
    }

    update_offcanvas_padding_top(); // Initial calculation
    $(window).resize(update_offcanvas_padding_top); // Recalculate on resize
});