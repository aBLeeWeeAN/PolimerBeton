function applyLightTheme() {
    removeFaviconsAndMeta();
    setLightFavicons();
    setLightMetaTags();
}

function applyDarkTheme() {
    removeFaviconsAndMeta();
    setDarkFavicons();
    setDarkMetaTags();
}

function removeFaviconsAndMeta() {
    const favicons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"], link[rel="shortcut icon"], link[rel="manifest"]');
    const metaTags = document.querySelectorAll('meta[name="msapplication-TileColor"], meta[name="msapplication-TileImage"], meta[name="theme-color"], meta[name="msapplication-config"]');
    
    favicons.forEach(favicon => favicon.remove());
    metaTags.forEach(meta => meta.remove());
}

function setLightFavicons() {
    createFavicon('/favicons/apple-touch-icon.png?v=7', 'apple-touch-icon', '180x180');
    createFavicon('/favicons/favicon-32x32.png?v=7', 'icon', '32x32');
    createFavicon('/favicons/favicon-194x194.png?v=7', 'icon', '194x194');
    createFavicon('/favicons/android-chrome-192x192.png?v=7', 'icon', '192x192');
    createFavicon('/favicons/favicon-16x16.png?v=7', 'icon', '16x16');
    createFavicon('/favicons/safari-pinned-tab.svg?v=7', 'mask-icon', null, '#6200ea');
    createFavicon('/favicons/favicon.ico?v=7', 'shortcut icon');
    createLink('/favicons/site.webmanifest?v=7', 'manifest');
}

function setDarkFavicons() {
    createFavicon('/favicons/dark/apple-touch-icon.png?v=7', 'apple-touch-icon', '180x180');
    createFavicon('/favicons/dark/favicon-32x32.png?v=7', 'icon', '32x32');
    createFavicon('/favicons/dark/favicon-194x194.png?v=7', 'icon', '194x194');
    createFavicon('/favicons/dark/android-chrome-192x192.png?v=7', 'icon', '192x192');
    createFavicon('/favicons/dark/favicon-16x16.png?v=7', 'icon', '16x16');
    createFavicon('/favicons/dark/safari-pinned-tab.svg?v=7', 'mask-icon', null, '#dd2c00');
    createFavicon('/favicons/dark/favicon.ico?v=7', 'shortcut icon');
    createLink('/favicons/dark/site.webmanifest?v=7', 'manifest');
}

function createFavicon(href, rel, sizes, color) {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (sizes) link.sizes = sizes;
    if (color && rel === "mask-icon") link.color = color;
    document.head.appendChild(link);
}

function createLink(href, rel) {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
}

function setLightMetaTags() {
    createMeta('msapplication-TileColor', '#603cba');
    createMeta('msapplication-TileImage', '/favicons/mstile-144x144.png?v=7');
    createMeta('theme-color', '#fffefd');
    createMeta('msapplication-config', '/favicons/browserconfig.xml?v=7');
}

function setDarkMetaTags() {
    createMeta('msapplication-TileColor', '#da532c');
    createMeta('msapplication-TileImage', '/favicons/dark/mstile-144x144.png?v=7');
    createMeta('theme-color', '#1f1e22');
    createMeta('msapplication-config', '/favicons/dark/browserconfig.xml?v=7');
}

function createMeta(name, content) {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
}

function checkAndApplyTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyDarkTheme();
    } else {
        applyLightTheme();
    }
}

checkAndApplyTheme();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    checkAndApplyTheme();
});

// function setFavicon(href, rel, sizes, color) {
//     let link = document.querySelector(`link[rel="${rel}"][sizes="${sizes}"]`);
//     if (!link) {
//         link = document.createElement('link');
//         link.rel = rel;
//         if (sizes) link.sizes = sizes;
//         document.head.appendChild(link);
//     }
//     link.href = href;
//     if (color && rel === "mask-icon") {
//         link.color = color;
//     }
// }

// function setManifest(href) {
//     let link = document.querySelector('link[rel="manifest"]');
//     if (!link) {
//         link = document.createElement('link');
//         link.rel = "manifest";
//         document.head.appendChild(link);
//     }
//     link.href = href;
// }

// function setMeta(name, content) {
//     let meta = document.querySelector(`meta[name="${name}"]`);
//     if (!meta) {
//         meta = document.createElement('meta');
//         meta.name = name;
//         document.head.appendChild(meta);
//     }
//     meta.content = content;
// }

// function apply_light_favicon() {
//     // Установка фавиконок для светлой темы
//     setFavicon("/favicons/apple-touch-icon.png?v=7", "apple-touch-icon", "180x180");
//     setFavicon("/favicons/favicon-32x32.png?v=7", "icon", "32x32");
//     setFavicon("/favicons/favicon-194x194.png?v=7", "icon", "194x194");
//     setFavicon("/favicons/android-chrome-192x192.png?v=7", "icon", "192x192");
//     setFavicon("/favicons/favicon-16x16.png?v=7", "icon", "16x16");
//     setFavicon("/favicons/safari-pinned-tab.svg?v=7", "mask-icon", null, "#6200ea");
//     setFavicon("/favicons/favicon.ico?v=7", "shortcut icon");
//     setManifest("/favicons/site.webmanifest?v=7");
//     setMeta("msapplication-TileColor", "#603cba");
//     setMeta("msapplication-TileImage", "/favicons/mstile-144x144.png?v=7");
//     setMeta("theme-color", "#fffefd");
// }

// function apply_dark_favicon() {
//     // Установка фавиконок для тёмной темы
//     setFavicon("/favicons/dark/apple-touch-icon.png?v=7", "apple-touch-icon", "180x180");
//     setFavicon("/favicons/dark/favicon-32x32.png?v=7", "icon", "32x32");
//     setFavicon("/favicons/dark/favicon-194x194.png?v=7", "icon", "194x194");
//     setFavicon("/favicons/dark/android-chrome-192x192.png?v=7", "icon", "192x192");
//     setFavicon("/favicons/dark/favicon-16x16.png?v=7", "icon", "16x16");
//     setFavicon("/favicons/dark/safari-pinned-tab.svg?v=7", "mask-icon", null, "#dd2c00");
//     setFavicon("/favicons/dark/favicon.ico?v=7", "shortcut icon");
//     setManifest("/favicons/dark/site.webmanifest?v=7");
//     setMeta("msapplication-TileColor", "#da532c");
//     setMeta("msapplication-TileImage", "/favicons/dark/mstile-144x144.png?v=7");
//     setMeta("theme-color", "#1f1e22");
// }

// // Проверяем тему пользователя и применяем соответствующую фавиконку
// if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//     apply_dark_favicon();
// } else {
//     apply_light_favicon();
// }

// // Добавляем слушатель на изменение темы
// window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
//     if (event.matches) {
//         apply_dark_favicon();
//     } else {
//         apply_light_favicon();
//     }
// });