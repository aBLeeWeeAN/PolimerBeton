// // Инициализация переменных для элементов
// const toggleTheme = document.getElementById("toggle-color-scheme");
// const toggleThemeMobile = document.getElementById("toggle-color-scheme__mobile");

// const resetToSystemTheme = document.getElementById("reset-to-system-color-scheme");
// const resetToSystemThemeMobile = document.getElementById("reset-to-system-color-scheme__mobile");

// const moonIcon = document.getElementById("my-moon-icon");
// const moonIconMobile = document.getElementById("my-moon-icon__mobile");

// const sunIcon = document.getElementById("my-sun-icon");
// const sunIconMobile = document.getElementById("my-sun-icon__mobile");

// const heroForegroundImage = document.getElementById("hero-fr-img");

// // Функция для установки темы
// async function setTheme(theme) {
//     document.documentElement.setAttribute('data-theme', theme);
//     document.documentElement.setAttribute('data-bs-theme', theme);

//     await new Promise(resolve => setTimeout(resolve, 100)); // Задержка для плавности изменения

//     if (theme === "light") {
//         moonIcon.style.opacity = 0;
//         moonIconMobile.style.opacity = 0;
//         sunIcon.style.opacity = 1;
//         sunIconMobile.style.opacity = 1;

//         if (heroForegroundImage != null) {
//             heroForegroundImage.style.opacity = 0.3;
//         }
//     } else {
//         moonIcon.style.opacity = 1;
//         moonIconMobile.style.opacity = 1;
//         sunIcon.style.opacity = 0;
//         sunIconMobile.style.opacity = 0;

//         if (heroForegroundImage != null) {
//             heroForegroundImage.style.opacity = 0.1;
//         }
//     }
// }

// // Функция для установки темы на основе системных настроек
// function setSystemTheme() {
//     const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
//     setTheme(systemTheme);
// }

// // Инициализация темы при загрузке страницы
// (async function initializeTheme() {
//     const storedTheme = localStorage.getItem('theme');
//     if (storedTheme) {
//         await setTheme(storedTheme);
//     } else {
//         setSystemTheme();
//     }
// })();

// // Обработчики кликов для переключения темы
// toggleTheme.onclick = async function() {
//     const currentTheme = document.documentElement.getAttribute("data-theme");
//     const targetTheme = currentTheme === "light" ? "dark" : "light";
//     await setTheme(targetTheme);
//     localStorage.setItem('theme', targetTheme);
// };

// toggleThemeMobile.onclick = toggleTheme.onclick;

// // Обработчик клика для сброса темы на системную
// resetToSystemTheme.onclick = async function() {
//     localStorage.removeItem('theme');
//     setSystemTheme();
// };

// resetToSystemThemeMobile.onclick = resetToSystemTheme.onclick;

// // Слушатель для отслеживания изменений системной темы
// window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function() {
//     if (!localStorage.getItem('theme')) {
//         setSystemTheme();
//     }
// });

// Инициализация переменных для элементов
const elements = {
    toggleTheme: document.getElementById("toggle-color-scheme"),
    toggleThemeMobile: document.getElementById("toggle-color-scheme__mobile"),
    resetToSystemTheme: document.getElementById("reset-to-system-color-scheme"),
    resetToSystemThemeMobile: document.getElementById("reset-to-system-color-scheme__mobile"),
    moonIcon: document.getElementById("my-moon-icon"),
    moonIconMobile: document.getElementById("my-moon-icon__mobile"),
    sunIcon: document.getElementById("my-sun-icon"),
    sunIconMobile: document.getElementById("my-sun-icon__mobile"),
    heroForegroundImage: document.getElementById("hero-fr-img")
};

// Функция для установки темы
async function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);

    // Задержка для плавности изменения
    await new Promise(resolve => setTimeout(resolve, 100));

    // Определение новых значений для свойств opacity
    const themeSettings = {
        light: {
            moonIconOpacity: 0,
            sunIconOpacity: 1,
            heroImageOpacity: 0.3
        },
        dark: {
            moonIconOpacity: 1,
            sunIconOpacity: 0,
            heroImageOpacity: 0.1
        }
    };

    // Обновляем стили в соответствии с темой
    const { moonIconOpacity, sunIconOpacity, heroImageOpacity } = themeSettings[theme];
    Object.assign(elements.moonIcon.style, { opacity: moonIconOpacity });
    Object.assign(elements.moonIconMobile.style, { opacity: moonIconOpacity });
    Object.assign(elements.sunIcon.style, { opacity: sunIconOpacity });
    Object.assign(elements.sunIconMobile.style, { opacity: sunIconOpacity });

    if (elements.heroForegroundImage) {
        elements.heroForegroundImage.style.opacity = heroImageOpacity;
    }
}

// Функция для установки темы на основе системных настроек
function setSystemTheme() {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(systemTheme);
}

// Инициализация темы при загрузке страницы
(async function initializeTheme() {
    const storedTheme = localStorage.getItem('theme');
    await setTheme(storedTheme || setSystemTheme());
})();

// Функция для переключения темы
async function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    await setTheme(targetTheme);
    localStorage.setItem('theme', targetTheme);
}

// Обработчики кликов для переключения темы
elements.toggleTheme.addEventListener('click', toggleTheme);
elements.toggleThemeMobile.addEventListener('click', toggleTheme);

// Обработчик клика для сброса темы на системную
function resetToSystemTheme() {
    localStorage.removeItem('theme');
    setSystemTheme();
}

elements.resetToSystemTheme.addEventListener('click', resetToSystemTheme);
elements.resetToSystemThemeMobile.addEventListener('click', resetToSystemTheme);

// Слушатель для отслеживания изменений системной темы
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!localStorage.getItem('theme')) {
        setSystemTheme();
    }
});