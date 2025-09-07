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
    const paths = window.faviconPaths.light;
    createFavicon(paths.appleTouchIcon, 'apple-touch-icon', '180x180');
    createFavicon(paths.favicon32x32, 'icon', '32x32');
    createFavicon(paths.favicon194x194, 'icon', '194x194');
    createFavicon(paths.androidChrome192x192, 'icon', '192x192');
    createFavicon(paths.favicon16x16, 'icon', '16x16');
    createFavicon(paths.safariPinnedTab, 'mask-icon', null, '#6200ea');
    createFavicon(paths.faviconIco, 'shortcut icon');
    createLink(paths.siteWebmanifest, 'manifest');
}

function setDarkFavicons() {
    const paths = window.faviconPaths.dark;
    createFavicon(paths.appleTouchIcon, 'apple-touch-icon', '180x180');
    createFavicon(paths.favicon32x32, 'icon', '32x32');
    createFavicon(paths.favicon194x194, 'icon', '194x194');
    createFavicon(paths.androidChrome192x192, 'icon', '192x192');
    createFavicon(paths.favicon16x16, 'icon', '16x16');
    createFavicon(paths.safariPinnedTab, 'mask-icon', null, '#dd2c00');
    createFavicon(paths.faviconIco, 'shortcut icon');
    createLink(paths.siteWebmanifest, 'manifest');
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
    const paths = window.faviconPaths.light;
    createMeta('msapplication-TileColor', '#603cba');
    createMeta('msapplication-TileImage', paths.mstile144x144);
    createMeta('theme-color', '#fffefd');
    createMeta('msapplication-config', paths.browserConfig);
}

function setDarkMetaTags() {
    const paths = window.faviconPaths.dark;
    createMeta('msapplication-TileColor', '#da532c');
    createMeta('msapplication-TileImage', paths.mstile144x144);
    createMeta('theme-color', '#1f1e22');
    createMeta('msapplication-config', paths.browserConfig);
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

// function applyLightTheme() {
//     removeFaviconsAndMeta();
//     setLightFavicons();
//     setLightMetaTags();
// }

// function applyDarkTheme() {
//     removeFaviconsAndMeta();
//     setDarkFavicons();
//     setDarkMetaTags();
// }

// function removeFaviconsAndMeta() {
//     const favicons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"], link[rel="shortcut icon"], link[rel="manifest"]');
//     const metaTags = document.querySelectorAll('meta[name="msapplication-TileColor"], meta[name="msapplication-TileImage"], meta[name="theme-color"], meta[name="msapplication-config"]');
    
//     favicons.forEach(favicon => favicon.remove());
//     metaTags.forEach(meta => meta.remove());
// }

// function setLightFavicons() {
//     createFavicon('{% static \'main_app/favicons/apple-touch-icon.png\' %}?v=7', 'apple-touch-icon', '180x180');
//     createFavicon('{% static \'main_app/favicons/favicon-32x32.png\' %}?v=7', 'icon', '32x32');
//     createFavicon('{% static \'main_app/favicons/favicon-194x194.png\' %}?v=7', 'icon', '194x194');
//     createFavicon('{% static \'main_app/favicons/android-chrome-192x192.png\' %}?v=7', 'icon', '192x192');
//     createFavicon('{% static \'main_app/favicons/favicon-16x16.png\' %}?v=7', 'icon', '16x16');
//     createFavicon('{% static \'main_app/favicons/safari-pinned-tab.svg\' %}?v=7', 'mask-icon', null, '#6200ea');
//     createFavicon('{% static \'main_app\' %}/favicons/favicon.ico?v=7', 'shortcut icon');
//     createLink('{% static \'main_app/favicons/site.webmanifest\' %}?v=7', 'manifest');
// }

// function setDarkFavicons() {
//     createFavicon('{% static \'main_app/favicons/dark/apple-touch-icon.png\' %}?v=7', 'apple-touch-icon', '180x180');
//     createFavicon('{% static \'main_app/favicons/dark/favicon-32x32.png\' %}?v=7', 'icon', '32x32');
//     createFavicon('{% static \'main_app/favicons/dark/favicon-194x194.png\' %}?v=7', 'icon', '194x194');
//     createFavicon('{% static \'main_app/favicons/dark/android-chrome-192x192.png\' %}?v=7', 'icon', '192x192');
//     createFavicon('{% static \'main_app/favicons/dark/favicon-16x16.png\' %}?v=7', 'icon', '16x16');
//     createFavicon('{% static \'main_app/favicons/dark/safari-pinned-tab.svg\' %}?v=7', 'mask-icon', null, '#dd2c00');
//     createFavicon('{% static \'main_app/favicons/dark/favicon.ico\' %}?v=7', 'shortcut icon');
//     createLink('{% static \'main_app/favicons/dark/site.webmanifest\' %}?v=7', 'manifest');
// }

// function createFavicon(href, rel, sizes, color) {
//     const link = document.createElement('link');
//     link.rel = rel;
//     link.href = href;
//     if (sizes) link.sizes = sizes;
//     if (color && rel === "mask-icon") link.color = color;
//     document.head.appendChild(link);
// }

// function createLink(href, rel) {
//     const link = document.createElement('link');
//     link.rel = rel;
//     link.href = href;
//     document.head.appendChild(link);
// }

// function setLightMetaTags() {
//     createMeta('msapplication-TileColor', '#603cba');
//     createMeta('msapplication-TileImage', '{% static \'main_app/favicons/mstile-144x144.png\' %}?v=7');
//     createMeta('theme-color', '#fffefd');
//     createMeta('msapplication-config', '{% static \'main_app/favicons/browserconfig.xml\' %}?v=7');
// }

// function setDarkMetaTags() {
//     createMeta('msapplication-TileColor', '#da532c');
//     createMeta('msapplication-TileImage', '{% static \'main_app/favicons/dark/mstile-144x144.png\' %}?v=7');
//     createMeta('theme-color', '#1f1e22');
//     createMeta('msapplication-config', '{% static \'main_app/favicons/dark/browserconfig.xml\' %}?v=7');
// }

// function createMeta(name, content) {
//     const meta = document.createElement('meta');
//     meta.name = name;
//     meta.content = content;
//     document.head.appendChild(meta);
// }

// function checkAndApplyTheme() {
//     if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
//         applyDarkTheme();
//     } else {
//         applyLightTheme();
//     }
// }

// checkAndApplyTheme();

// window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
//     checkAndApplyTheme();
// });