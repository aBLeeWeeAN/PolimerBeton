document.addEventListener("DOMContentLoaded", function () {
    // Определяем код для вставки
    const picture_html = `
        <picture>
            <!-- Определяем изображение для самых маленьких экранов -->
            <source type="image/webp" srcset="images/hero/hero_bc_xs.webp" media="(max-width: 320px)" sizes="(max-width: 320px) 100vw">
            
            <!-- Определяем изображение для маленьких экранов -->
            <source type="image/webp" srcset="images/hero/hero_bc_sm.webp" media="(max-width: 480px)" sizes="(max-width: 480px) 100vw">
            
            <!-- Определяем изображение для средних экранов -->
            <source type="image/webp" srcset="images/hero/hero_bc_md.webp" media="(max-width: 640px)" sizes="(max-width: 640px) 100vw">
            
            <!-- Определяем изображение для больших экранов -->
            <source type="image/webp" srcset="images/hero/hero_bc_lg.webp" media="(max-width: 800px)" sizes="(max-width: 800px) 100vw">
            
            <!-- Определяем изображение для очень больших экранов -->
            <source type="image/webp" srcset="images/hero/hero_bc_xl.webp" media="(max-width: 1024px)" sizes="(max-width: 1024px) 100vw">
            
            <!-- Изображение по умолчанию для случаев, когда медиа-запросы не сработали -->
            <img src="images/hero/hero_bc_xxl.webp" 
                 width="1280" 
                 height="760" 
                 role="presentation"
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