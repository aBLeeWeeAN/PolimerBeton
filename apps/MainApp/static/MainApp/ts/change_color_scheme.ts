// Функция для ожидания полной загрузки картинки
function waitForImageLoad(img: HTMLImageElement | null): Promise<void> {
    return new Promise((resolve) => {
        if (!img || img.complete) {
            resolve();
        } else {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // на случай ошибки загрузки
        }
    });
}

// Главная функция инициализации темы
async function initializeTheme() {
    // Инициализация переменных для элементов
    const toggleTheme = document.getElementById("toggle-color-scheme") as HTMLInputElement | null;
    const toggleThemeMobile = document.getElementById("toggle-color-scheme__mobile") as HTMLInputElement | null;

    const resetToSystemTheme = document.getElementById("reset-to-system-color-scheme") as HTMLInputElement | null;
    const resetToSystemThemeMobile = document.getElementById("reset-to-system-color-scheme__mobile") as HTMLInputElement | null;

    const moonIcon = document.getElementById("my-moon-icon") as SVGSVGElement | null;
    const moonIconMobile = document.getElementById("my-moon-icon__mobile") as SVGSVGElement | null;

    const sunIcon = document.getElementById("my-sun-icon") as SVGSVGElement | null;
    const sunIconMobile = document.getElementById("my-sun-icon__mobile") as SVGSVGElement | null;

    const heroForegroundImage = document.getElementById("hero-fr-img") as HTMLImageElement | null;

    // Проверки на существование обязательных элементов
    if (!toggleTheme) throw new Error("Toggle theme button not found!");
    if (!toggleThemeMobile) throw new Error("Toggle theme button (mobile) not found!");
    if (!resetToSystemTheme) throw new Error("Reset to system theme button not found!");
    if (!resetToSystemThemeMobile) throw new Error("Reset to system theme button (mobile) not found!");
    if (!moonIcon) throw new Error("Moon icon not found!");
    if (!moonIconMobile) throw new Error("Moon icon (mobile) not found!");
    if (!sunIcon) throw new Error("Sun icon not found!");
    if (!sunIconMobile) throw new Error("Sun icon (mobile) not found!");

    // Если есть картинка — ждём её загрузки
    if (heroForegroundImage) {
        await waitForImageLoad(heroForegroundImage);
    }

    // Функция для установки темы
    async function setTheme(theme: string) {
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.setAttribute("data-bs-theme", theme);

        await new Promise((resolve) => setTimeout(resolve, 100)); // Задержка для плавности

        if (theme === "light") {
            moonIcon!.style.opacity = "0";
            moonIconMobile!.style.opacity = "0";
            sunIcon!.style.opacity = "1";
            sunIconMobile!.style.opacity = "1";
            if (heroForegroundImage) heroForegroundImage.style.opacity = "0.3";
        } else {
            moonIcon!.style.opacity = "1";
            moonIconMobile!.style.opacity = "1";
            sunIcon!.style.opacity = "0";
            sunIconMobile!.style.opacity = "0";
            if (heroForegroundImage) heroForegroundImage.style.opacity = "0.1";
        }
    }

    // Функция для установки системной темы
    function setSystemTheme() {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        setTheme(systemTheme);
    }

    // Инициализация темы при загрузке
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
        await setTheme(storedTheme);
    } else {
        setSystemTheme();
    }

    // Обработчики кликов
    toggleTheme.addEventListener("click", async () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const targetTheme = currentTheme === "light" ? "dark" : "light";
        await setTheme(targetTheme);
        localStorage.setItem("theme", targetTheme);
    });

    toggleThemeMobile.addEventListener("click", async () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const targetTheme = currentTheme === "light" ? "dark" : "light";
        await setTheme(targetTheme);
        localStorage.setItem("theme", targetTheme);
    });

    resetToSystemTheme.addEventListener("click", () => {
        localStorage.removeItem("theme");
        setSystemTheme();
    });

    resetToSystemThemeMobile.addEventListener("click", () => {
        localStorage.removeItem("theme");
        setSystemTheme();
    });

    // Отслеживание системной темы
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (!localStorage.getItem("theme")) {
            setSystemTheme();
        }
    });
}

// Ждём полной загрузки страницы, включая картинки
window.addEventListener("load", () => {
    initializeTheme().catch((err) => console.error("Error initializing theme:", err));
});

export {};
