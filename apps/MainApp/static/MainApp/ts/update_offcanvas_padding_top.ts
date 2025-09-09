import $ from "jquery";

$(() => {
    function updateOffcanvasPaddingTop() {
        const $topNavbar = $(".fixed-top-navbar");
        const $offcanvas = $(".offcanvas");

        if ($topNavbar.length && $offcanvas.length) {
            // округляем вверх до целого числа
            const topNavbarHeight = Math.ceil($topNavbar.outerHeight() || 0);
            $offcanvas.css("padding-top", `${topNavbarHeight}px`);
        }
    }

    // Initial calculation
    updateOffcanvasPaddingTop();

    // Recalculate on resize
    $(window).on("resize", updateOffcanvasPaddingTop);
});

export {};
