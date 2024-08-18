function setFavicon(href, rel, sizes, color) {
    let link = document.querySelector(`link[rel="${rel}"][sizes="${sizes}"]`);
    if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        if (sizes) link.sizes = sizes;
        document.head.appendChild(link);
    }
    link.href = href;
    if (color && rel === "mask-icon") {
        link.color = color;
    }
}

function setManifest(href) {
    let link = document.querySelector('link[rel="manifest"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = "manifest";
        document.head.appendChild(link);
    }
    link.href = href;
}

function setMeta(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
    }
    meta.content = content;
}

function apply_light_favicon() {
    // Установка фавиконок для светлой темы
    setFavicon("/favicons/apple-touch-icon.png?v=7", "apple-touch-icon", "180x180");
    setFavicon("/favicons/favicon-32x32.png?v=7", "icon", "32x32");
    setFavicon("/favicons/favicon-194x194.png?v=7", "icon", "194x194");
    setFavicon("/favicons/android-chrome-192x192.png?v=7", "icon", "192x192");
    setFavicon("/favicons/favicon-16x16.png?v=7", "icon", "16x16");
    setFavicon("/favicons/safari-pinned-tab.svg?v=7", "mask-icon", null, "#6200ea");
    setFavicon("/favicons/favicon.ico?v=7", "shortcut icon");
    setManifest("/favicons/site.webmanifest?v=7");
    setMeta("msapplication-TileColor", "#603cba");
    setMeta("msapplication-TileImage", "/favicons/mstile-144x144.png?v=7");
    setMeta("theme-color", "#fffefd");
}

function apply_dark_favicon() {
    // Установка фавиконок для тёмной темы
    setFavicon("/favicons/dark/apple-touch-icon.png?v=7", "apple-touch-icon", "180x180");
    setFavicon("/favicons/dark/favicon-32x32.png?v=7", "icon", "32x32");
    setFavicon("/favicons/dark/favicon-194x194.png?v=7", "icon", "194x194");
    setFavicon("/favicons/dark/android-chrome-192x192.png?v=7", "icon", "192x192");
    setFavicon("/favicons/dark/favicon-16x16.png?v=7", "icon", "16x16");
    setFavicon("/favicons/dark/safari-pinned-tab.svg?v=7", "mask-icon", null, "#dd2c00");
    setFavicon("/favicons/dark/favicon.ico?v=7", "shortcut icon");
    setManifest("/favicons/dark/site.webmanifest?v=7");
    setMeta("msapplication-TileColor", "#da532c");
    setMeta("msapplication-TileImage", "/favicons/dark/mstile-144x144.png?v=7");
    setMeta("theme-color", "#1f1e22");
}

// Проверяем тему пользователя и применяем соответствующую фавиконку
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    apply_dark_favicon();
} else {
    apply_light_favicon();
}

// Добавляем слушатель на изменение темы
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        apply_dark_favicon();
    } else {
        apply_light_favicon();
    }
});