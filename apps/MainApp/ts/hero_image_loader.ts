document.addEventListener("DOMContentLoaded", function () {
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
            
            <!-- Изображение по умолчанию для случаев, когда медиа-запросы не сработали -->
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
    const hero_section = document.getElementById('Hero');
    if (hero_section) {
        hero_section.insertAdjacentHTML('afterbegin', picture_html);
    }
});

// document.addEventListener("DOMContentLoaded", function () {
//     // Кэшируем объект heroImages
//     const heroImages = window.heroImages;

//     // Определяем HTML для вставки
//     const pictureHTML = `
//         <picture>
//             <source type="image/webp" srcset="${heroImages.xs}" media="(max-width: 320px)" sizes="(max-width: 320px) 100vw">
//             <source type="image/webp" srcset="${heroImages.sm}" media="(max-width: 480px)" sizes="(max-width: 480px) 100vw">
//             <source type="image/webp" srcset="${heroImages.md}" media="(max-width: 640px)" sizes="(max-width: 640px) 100vw">
//             <source type="image/webp" srcset="${heroImages.lg}" media="(max-width: 800px)" sizes="(max-width: 800px) 100vw">
//             <source type="image/webp" srcset="${heroImages.xl}" media="(max-width: 1024px)" sizes="(max-width: 1024px) 100vw">
//             <img src="${heroImages.xxl}" 
//                  width="3959" 
//                  height="2297"
//                  decoding="async"
//                  fetchpriority="high"
//                  alt="Задний фон блока Hero"
//                  id="hero-fr-img">
//         </picture>
//     `;

//     // Вставляем HTML в контейнер
//     const heroSection = document.getElementById('Hero');
//     if (heroSection) {
//         heroSection.insertAdjacentHTML('afterbegin', pictureHTML);
//     }
// });