let lastScrollTop = 0;

const header = document.querySelector('.fixed-top-navbar');
const offcanvas = document.getElementById('offcanvasNavbar');

// Переменная для отслеживания состояния offcanvas
let offcanvasIsShown = false;

// Функция для обновления состояния прокрутки
function updateScrollState() {
    if (document.documentElement.clientWidth < 576) {
        if (offcanvasIsShown) {
            document.documentElement.style.overflowY = 'hidden';
        } else {
            document.documentElement.style.overflowY = 'scroll';
        }
    } else {
        document.documentElement.style.overflowY = 'scroll';
    }
}

// Событие при скрытии offcanvas
offcanvas.addEventListener('hidden.bs.offcanvas', function(event) {
    offcanvasIsShown = false;
    updateScrollState();
});

// Событие при показе offcanvas
offcanvas.addEventListener('show.bs.offcanvas', function(event) {
    offcanvasIsShown = true;
    updateScrollState();
});

// Обработчик события изменения размера окна
window.addEventListener('resize', function() {
    updateScrollState();
});

// Обработчик события прокрутки
window.addEventListener('scroll', () => {
    // Проверка, скрыт ли .offcanvas-body
    if (!offcanvasIsShown) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            // Прокрутка вниз
            header.style.transform = 'translateY(-100%)';
            header.style.boxShadow = 'none';
        } else {
            // Прокрутка вверх
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = '0 .761rem .761rem rgba(0, 0, 0, 0.1)';
        }
        lastScrollTop = scrollTop;
    }
});

// let lastScrollTop = 0;

// const header = document.querySelector('.fixed-top-navbar');
// const offcanvas = document.getElementById('offcanvasNavbar');

// // Переменная для отслеживания состояния offcanvas
// let offcanvasIsShown = false;

// // Функция для обновления состояния прокрутки
// function updateScrollState() {
//     if (document.documentElement.clientWidth < 576) {
//         document.documentElement.style.overflowY = offcanvasIsShown ? 'hidden' : 'scroll';
//     } else {
//         document.documentElement.style.overflowY = 'scroll';
//     }
// }

// // Дебаунсер для обработчика scroll
// function debounce(func, wait) {
//     let timeout;
//     return function() {
//         clearTimeout(timeout);
//         timeout = setTimeout(func, wait);
//     };
// }

// // Событие при скрытии offcanvas
// offcanvas.addEventListener('hidden.bs.offcanvas', () => {
//     offcanvasIsShown = false;
//     updateScrollState();
// });

// // Событие при показе offcanvas
// offcanvas.addEventListener('show.bs.offcanvas', () => {
//     offcanvasIsShown = true;
//     updateScrollState();
// });

// // Используем дебаунсинг для обработки изменения размера окна
// window.addEventListener('resize', debounce(updateScrollState, 200)); // 200 мс - время ожидания для дебаунсинга

// // Оптимизированный обработчик события прокрутки с дебаунсингом
// window.addEventListener('scroll', debounce(() => {
//     if (!offcanvasIsShown) {
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//         if (scrollTop > lastScrollTop) {
//             // Прокрутка вниз
//             header.style.transform = 'translateY(-100%)';
//             header.style.boxShadow = 'none';
//         } else {
//             // Прокрутка вверх
//             header.style.transform = 'translateY(0)';
//             header.style.boxShadow = '0 .761rem .761rem rgba(0, 0, 0, 0.1)';
//         }
//         lastScrollTop = scrollTop;
//     }
// }, 100)); // 100 мс - время ожидания для дебаунсинга