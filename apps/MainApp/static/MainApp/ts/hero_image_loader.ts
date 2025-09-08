// Определяем тип для heroImages
interface HeroImages {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
}

// Расширяем глобальный объект window
declare global {
    interface Window {
        heroImages: HeroImages;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Определяем код для вставки
    const picture_html = `
        <picture>
            <!-- Определяем изображение для самых маленьких экранов -->
            <source type="image/webp" srcset="${window.heroImages.xs}" media="(max-width: 320px)" sizes="(max-width: 320px) 100vw">
            
            <!-- Определяем изображение для маленьких экранов -->
            <source type="image/webp" srcset="${window.heroImages.sm}" media="(max-width: 480px)" sizes="(max-width: 480px) 100vw">
            
            <!-- Определяем изображение для средних экранов -->
            <source type="image/webp" srcset="${window.heroImages.md}" media="(max-width: 640px)" sizes="(max-width: 640px) 100vw">
            
            <!-- Определяем изображение для больших экранов -->
            <source type="image/webp" srcset="${window.heroImages.lg}" media="(max-width: 800px)" sizes="(max-width: 800px) 100vw">
            
            <!-- Определяем изображение для очень больших экранов -->
            <source type="image/webp" srcset="${window.heroImages.xl}" media="(max-width: 1024px)" sizes="(max-width: 1024px) 100vw">
            
            <!-- Изображение по умолчанию -->
            <img src="${window.heroImages.xxl}" 
                 width="3959" 
                 height="2297"
                 decoding="async"
                 fetchpriority="high"
                 alt="Задний фон блока Hero"
                 id="hero-fr-img">
        </picture>
    `;

    // Найти контейнер #Hero и вставить код
    const hero_section = document.getElementById("Hero");

    if (!hero_section) {
        throw new Error("Error --- hero_image_loader.ts --- Hero section not found!");
    }

    hero_section.insertAdjacentHTML("afterbegin", picture_html);
});

export {};
