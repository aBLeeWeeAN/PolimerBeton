import $ from "jquery";

$(() => {
    function updateHeroContainerMarginTop() {
        const $topNavbar = $(".fixed-top-navbar");
        const $heroContainer = $("#Hero-Container");

        if ($topNavbar.length && $heroContainer.length) {
            const topNavbarHeight = $topNavbar.outerHeight() || 0;
            $heroContainer.css("margin-top", `${topNavbarHeight}px`);
        }
    }

    // Initial calculation
    updateHeroContainerMarginTop();

    // Recalculate on resize
    $(window).on("resize", updateHeroContainerMarginTop);
});

export {};
