//? New script
import $ from "jquery";

$(() => {
    function updateOffcanvasBodyHeight() {
        const $topNavbar = $(".fixed-top-navbar");
        const $offcanvasBody = $(".offcanvas-body");

        if ($offcanvasBody.length) {
            if (document.documentElement.clientWidth < 576) {
                const topNavbarHeight = $topNavbar.outerHeight() || 0;

                // Берем максимально корректную высоту видимой области
                const viewportHeight = Math.max(window.innerHeight, document.documentElement.clientHeight);

                // Рассчитываем высоту, округляем вверх и добавляем +1 пиксель
                // const height = Math.ceil(viewportHeight - topNavbarHeight) + 1;
                const height = Math.ceil(viewportHeight - topNavbarHeight);

                $offcanvasBody.css("height", `${height}px`);
            } else {
                $offcanvasBody.css("height", "auto");
            }
        }
    }

    // Initial calculation
    updateOffcanvasBodyHeight();

    // Recalculate on resize and orientation change
    $(window).on("resize orientationchange", updateOffcanvasBodyHeight);
});

export {};

//? Old script
// import $ from "jquery";

// $(() => {
//     function updateOffcanvasBodyHeight() {
//         const $topNavbar = $(".fixed-top-navbar");
//         const $offcanvasBody = $(".offcanvas-body");

//         if ($offcanvasBody.length) {
//             if (document.documentElement.clientWidth < 576) {
//                 const topNavbarHeight = $topNavbar.outerHeight() || 0;
//                 $offcanvasBody.css("height", `${window.innerHeight - topNavbarHeight}px`);
//                 // Если нужно: $offcanvasBody.css("max-height", `${window.innerHeight - topNavbarHeight}px`);
//             } else {
//                 $offcanvasBody.css("height", "auto");
//             }
//         }
//     }

//     // Initial calculation
//     updateOffcanvasBodyHeight();

//     // Recalculate on resize
//     $(window).on("resize", updateOffcanvasBodyHeight);
// });

// export {};
