//? New script
let lastScrollTop = 0;

const header = document.querySelector(".fixed-top-navbar") as HTMLElement | null;
const offcanvas = document.getElementById("offcanvasNavbar") as HTMLElement | null;
const navMenu = offcanvas?.querySelector(".nav-menu-for-site-sections") as HTMLElement | null;

if (!header) throw new Error("Header not found!");
if (!offcanvas) throw new Error("Offcanvas not found!");
if (!navMenu) throw new Error("nav-menu-for-site-sections not found!");

let offcanvasIsShown = false;

// ====== Блокировка скролла за offcanvas, разрешаем прокрутку только navMenu ======
function preventTouchScroll(e: TouchEvent) {
    // Разрешаем прокрутку внутри navMenu
    if (navMenu && navMenu.contains(e.target as Node)) {
        return;
    }
    e.preventDefault();
}

function updateScrollState() {
    if (document.documentElement.clientWidth >= 576) {
        // Десктоп — обычный скролл
        document.documentElement.style.overflowY = "scroll";
        document.body.removeEventListener("touchmove", preventTouchScroll);
        return;
    }

    if (offcanvasIsShown) {
        document.documentElement.style.overflowY = "hidden";
        document.body.addEventListener("touchmove", preventTouchScroll, { passive: false });

        // На мобильных после клика по ссылке внутри offcanvas блокируем снова
        const links = offcanvas!.querySelectorAll("a[href^='#']");
        links.forEach((link) => {
            link.addEventListener("click", () => {
                setTimeout(() => {
                    // Восстанавливаем блокировку через небольшой таймаут
                    document.body.addEventListener("touchmove", preventTouchScroll, { passive: false });
                }, 10);
            });
        });
    } else {
        document.documentElement.style.overflowY = "scroll";
        document.body.removeEventListener("touchmove", preventTouchScroll);
    }
}

// ====== События Offcanvas ======
offcanvas.addEventListener("show.bs.offcanvas", () => {
    offcanvasIsShown = true;
    updateScrollState();
});

offcanvas.addEventListener("hidden.bs.offcanvas", () => {
    offcanvasIsShown = false;
    updateScrollState();
});

// ====== Resize/orientation ======
window.addEventListener("resize", updateScrollState);
window.addEventListener("orientationchange", updateScrollState);

// ====== Header hide/show на скролл ======
window.addEventListener("scroll", () => {
    if (!offcanvasIsShown) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.scrollY || window.pageYOffset;
            if (scrollTop > lastScrollTop) {
                header.style.transform = "translateY(-100%)";
                header.style.boxShadow = "none";
            } else {
                header.style.transform = "translateY(0)";
                header.style.boxShadow = "0 .761rem .761rem rgba(0, 0, 0, 0.1)";
            }
            lastScrollTop = scrollTop;
        });
    }
});

export {};

//? Old script
// let lastScrollTop = 0;

// const header = document.querySelector(".fixed-top-navbar") as HTMLElement | null;
// const offcanvas = document.getElementById("offcanvasNavbar") as HTMLElement | null;

// if (!header) {
//     throw new Error("Error --- change_offcanvas_scroll_state.ts --- Header not found!");
// }

// if (!offcanvas) {
//     throw new Error("Error --- change_offcanvas_scroll_state.ts --- Offcanvas not found!");
// }

// // Переменная для отслеживания состояния offcanvas
// let offcanvasIsShown = false;

// // Функция для обновления состояния прокрутки
// function updateScrollState() {
//     if (document.documentElement.clientWidth < 576) {
//         document.documentElement.style.overflowY = offcanvasIsShown ? "hidden" : "scroll";
//     } else {
//         document.documentElement.style.overflowY = "scroll";
//     }
// }

// // Событие при скрытии offcanvas
// offcanvas.addEventListener("hidden.bs.offcanvas", () => {
//     offcanvasIsShown = false;
//     updateScrollState();
// });

// // Событие при показе offcanvas
// offcanvas.addEventListener("show.bs.offcanvas", () => {
//     offcanvasIsShown = true;
//     updateScrollState();
// });

// // Обработчик события изменения размера окна
// window.addEventListener("resize", updateScrollState);

// // Обработчик события прокрутки с использованием requestAnimationFrame
// window.addEventListener("scroll", () => {
//     if (!offcanvasIsShown) {
//         window.requestAnimationFrame(() => {
//             const scrollTop = window.scrollY || window.pageYOffset;
//             if (scrollTop > lastScrollTop) {
//                 // Прокрутка вниз
//                 header.style.transform = "translateY(-100%)";
//                 header.style.boxShadow = "none";
//             } else {
//                 // Прокрутка вверх
//                 header.style.transform = "translateY(0)";
//                 header.style.boxShadow = "0 .761rem .761rem rgba(0, 0, 0, 0.1)";
//             }
//             lastScrollTop = scrollTop;
//         });
//     }
// });

// export {};
