const offcanvasNavbar = document.getElementById('offcanvasNavbar');
const navbarToggler = document.querySelector('.navbar-toggler');

offcanvasNavbar.addEventListener('show.bs.offcanvas', () => {
    navbarToggler.classList.remove('collapsed');
});

offcanvasNavbar.addEventListener('hide.bs.offcanvas', () => {
    navbarToggler.classList.add('collapsed');
});