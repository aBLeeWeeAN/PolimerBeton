let lastScrollTop = 0;

const header = document.querySelector(".fixed-top-navbar") as HTMLElement | null;
const offcanvas = document.getElementById("offcanvasNavbar") as HTMLElement | null;

if (!header) {
    throw new Error("Error --- change_offcanvas_scroll_state.ts --- Header not found!");
}

if (!offcanvas) {
    throw new Error("Error --- change_offcanvas_scroll_state.ts --- Offcanvas not found!");
}

// Переменная для отслеживания состояния offcanvas
let offcanvasIsShown = false;

// Функция для обновления состояния прокрутки
function updateScrollState() {
    if (document.documentElement.clientWidth < 576) {
        document.documentElement.style.overflowY = offcanvasIsShown ? "hidden" : "scroll";
    } else {
        document.documentElement.style.overflowY = "scroll";
    }
}

// Событие при скрытии offcanvas
offcanvas.addEventListener("hidden.bs.offcanvas", () => {
    offcanvasIsShown = false;
    updateScrollState();
});

// Событие при показе offcanvas
offcanvas.addEventListener("show.bs.offcanvas", () => {
    offcanvasIsShown = true;
    updateScrollState();
});

// Обработчик события изменения размера окна
window.addEventListener("resize", updateScrollState);

// Обработчик события прокрутки с использованием requestAnimationFrame
window.addEventListener("scroll", () => {
    if (!offcanvasIsShown) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.scrollY || window.pageYOffset;
            if (scrollTop > lastScrollTop) {
                // Прокрутка вниз
                header.style.transform = "translateY(-100%)";
                header.style.boxShadow = "none";
            } else {
                // Прокрутка вверх
                header.style.transform = "translateY(0)";
                header.style.boxShadow = "0 .761rem .761rem rgba(0, 0, 0, 0.1)";
            }
            lastScrollTop = scrollTop;
        });
    }
});

export {};
