$(document).ready(function () {
    function update_hero_container_margin_top() {
        var top_navbar_height = $('.fixed-top-navbar').outerHeight();
        $('#Hero-Container').css('margin-top', top_navbar_height + 'px');
    }
    
    update_hero_container_margin_top(); // Initial calculation
    $(window).resize(update_hero_margin_top); // Recalculate on resize
});