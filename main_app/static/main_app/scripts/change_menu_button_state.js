// const offcanvas_navbar = document.getElementById('offcanvasNavbar');
// const navbar_toggler = document.getElementById("my-menu-button");

// offcanvas_navbar.addEventListener('show.bs.offcanvas', () => {
//     navbar_toggler.setAttribute("aria-expanded", "true");
// });

// offcanvas_navbar.addEventListener('hide.bs.offcanvas', () => {
//     navbar_toggler.setAttribute("aria-expanded", "false");
// });

const offcanvasNavbar = document.getElementById('offcanvasNavbar');
const navbarToggler = document.getElementById('my-menu-button');

// Функция для обновления атрибута aria-expanded
function updateAriaExpanded(isExpanded) {
    navbarToggler.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
}

// Обработчики событий show и hide для offcanvas
offcanvasNavbar.addEventListener('show.bs.offcanvas', () => updateAriaExpanded(true));
offcanvasNavbar.addEventListener('hide.bs.offcanvas', () => updateAriaExpanded(false));