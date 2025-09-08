import $ from "jquery";

$(() => {
    function updateOffcanvasBodyHeight() {
        const $topNavbar = $(".fixed-top-navbar");
        const $offcanvasBody = $(".offcanvas-body");

        if ($offcanvasBody.length) {
            if (document.documentElement.clientWidth < 576) {
                const topNavbarHeight = $topNavbar.outerHeight() || 0;
                $offcanvasBody.css("height", `${window.innerHeight - topNavbarHeight}px`);
                // Если нужно: $offcanvasBody.css("max-height", `${window.innerHeight - topNavbarHeight}px`);
            } else {
                $offcanvasBody.css("height", "auto");
            }
        }
    }

    // Initial calculation
    updateOffcanvasBodyHeight();

    // Recalculate on resize
    $(window).on("resize", updateOffcanvasBodyHeight);
});

export {};
