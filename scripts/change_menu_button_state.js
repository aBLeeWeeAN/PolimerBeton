// 1
const offcanvas_navbar = document.getElementById('offcanvasNavbar');
const navbar_toggler = document.getElementById("my-menu-button");

offcanvas_navbar.addEventListener('show.bs.offcanvas', () => {
    navbar_toggler.setAttribute("aria-expanded", "true");
});

offcanvas_navbar.addEventListener('hide.bs.offcanvas', () => {
    navbar_toggler.setAttribute("aria-expanded", "false");
});


// old
// const offcanvasNavbar = document.getElementById('offcanvasNavbar');
// const navbarToggler = document.querySelector('.navbar-toggler');

// offcanvasNavbar.addEventListener('show.bs.offcanvas', () => {
//     navbarToggler.classList.add('menu-visible');
// });

// offcanvasNavbar.addEventListener('hide.bs.offcanvas', () => {
//     navbarToggler.classList.remove('menu-visible');
// });


// bad
// const navbar_toggler = document.getElementById("my-menu-button");

// navbar_toggler.addEventListener("click", () => {
//     const current_state = navbar_toggler.getAttribute("data-state");

//     if (!current_state || current_state === "closed") {
//         navbar_toggler.setAttribute("data-state", "opened");
//         navbar_toggler.setAttribute("aria-expanded", "true");
//     } else {
//         navbar_toggler.setAttribute("data-state", "closed");
//         navbar_toggler.setAttribute("aria-expanded", "false");
//     }
//   });