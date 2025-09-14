// Получаем элементы и приводим к нужным типам
const offcanvasNavbar = document.getElementById("offcanvasNavbar") as HTMLElement | null;
const navbarToggler = document.getElementById("my-menu-button") as HTMLElement | null;

// Проверка наличия элементов
if (!offcanvasNavbar) {
    throw new Error("Offcanvas navbar not found");
}

if (!navbarToggler) {
    throw new Error("Navbar toggler button not found");
}

// Функция для обновления атрибута aria-expanded
function updateAriaExpanded(isExpanded: boolean) {
    navbarToggler!.setAttribute("aria-expanded", isExpanded ? "true" : "false");
}

// Обработчики событий show и hide для offcanvas
offcanvasNavbar.addEventListener("show.bs.offcanvas", () => updateAriaExpanded(true));
offcanvasNavbar.addEventListener("hide.bs.offcanvas", () => updateAriaExpanded(false));

export {};
