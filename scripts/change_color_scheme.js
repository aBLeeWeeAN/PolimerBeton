var toggle_theme = document.getElementById("toggle-color-scheme");
var toggle_theme__mobile = document.getElementById("toggle-color-scheme__mobile");

var reset_to_system_theme = document.getElementById("reset-to-system-color-scheme");
var reset_to_system_theme__mobile = document.getElementById("reset-to-system-color-scheme__mobile");

var moon_icon = document.getElementById("my-moon-icon");
var moon_icon__mobile = document.getElementById("my-moon-icon__mobile");

var sun_icon = document.getElementById("my-sun-icon");
var sun_icon__mobile = document.getElementById("my-sun-icon__mobile");

// Функция для установки темы на основе системных настроек
function setSystemTheme() {
    var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(systemTheme);
}

// Функция для установки темы
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);

    if (theme === "light") {
        moon_icon.style.display = "inline";
        moon_icon__mobile.style.display = "inline";
        sun_icon.style.display = "none";
        sun_icon__mobile.style.display = "none";
    } else {
        moon_icon.style.display = "none";
        moon_icon__mobile.style.display = "none";
        sun_icon.style.display = "inline";
        sun_icon__mobile.style.display = "inline";
    }
}

// Инициализация темы при загрузке страницы
var storedTheme = localStorage.getItem('theme');
if (storedTheme) {
    setTheme(storedTheme);
} else {
    setSystemTheme();
}

// Обработчики кликов для переключения темы
toggle_theme.onclick = function() {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(targetTheme);
    localStorage.setItem('theme', targetTheme);
};

toggle_theme__mobile.onclick = toggle_theme.onclick;

// Обработчик клика для сброса темы на системную
reset_to_system_theme.onclick = function() {
    localStorage.removeItem('theme');
    setSystemTheme();
};

reset_to_system_theme__mobile.onclick = reset_to_system_theme.onclick;

// Слушатель для отслеживания изменений системной темы
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function() {
    if (!localStorage.getItem('theme')) {
        setSystemTheme();
    }
});