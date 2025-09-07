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
    const favicons = document.querySelectorAll(
        'link[rel="icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"], link[rel="shortcut icon"], link[rel="manifest"]'
    );
    const metaTags = document.querySelectorAll(
        'meta[name="msapplication-TileColor"], meta[name="msapplication-TileImage"], meta[name="theme-color"], meta[name="msapplication-config"]'
    );

    favicons.forEach((favicon) => favicon.remove());
    metaTags.forEach((meta) => meta.remove());
}

function setLightFavicons() {
    const paths = window.faviconPaths.light;
    createFavicon(paths.appleTouchIcon, "apple-touch-icon", "180x180");
    createFavicon(paths.favicon32x32, "icon", "32x32");
    createFavicon(paths.favicon194x194, "icon", "194x194");
    createFavicon(paths.androidChrome192x192, "icon", "192x192");
    createFavicon(paths.favicon16x16, "icon", "16x16");
    createFavicon(paths.safariPinnedTab, "mask-icon", null, "#6200ea");
    createFavicon(paths.faviconIco, "shortcut icon");
    createLink(paths.siteWebmanifest, "manifest");
}

function setDarkFavicons() {
    const paths = window.faviconPaths.dark;
    createFavicon(paths.appleTouchIcon, "apple-touch-icon", "180x180");
    createFavicon(paths.favicon32x32, "icon", "32x32");
    createFavicon(paths.favicon194x194, "icon", "194x194");
    createFavicon(paths.androidChrome192x192, "icon", "192x192");
    createFavicon(paths.favicon16x16, "icon", "16x16");
    createFavicon(paths.safariPinnedTab, "mask-icon", null, "#dd2c00");
    createFavicon(paths.faviconIco, "shortcut icon");
    createLink(paths.siteWebmanifest, "manifest");
}

function createFavicon(href, rel, sizes, color) {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    if (sizes) link.sizes = sizes;
    if (color && rel === "mask-icon") link.color = color;
    document.head.appendChild(link);
}

function createLink(href, rel) {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
}

function setLightMetaTags() {
    const paths = window.faviconPaths.light;
    createMeta("msapplication-TileColor", "#603cba");
    createMeta("msapplication-TileImage", paths.mstile144x144);
    createMeta("theme-color", "#fffefd");
    createMeta("msapplication-config", paths.browserConfig);
}

function setDarkMetaTags() {
    const paths = window.faviconPaths.dark;
    createMeta("msapplication-TileColor", "#da532c");
    createMeta("msapplication-TileImage", paths.mstile144x144);
    createMeta("theme-color", "#1f1e22");
    createMeta("msapplication-config", paths.browserConfig);
}

function createMeta(name, content) {
    const meta = document.createElement("meta");
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
}

function checkAndApplyTheme() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        applyDarkTheme();
    } else {
        applyLightTheme();
    }
}

checkAndApplyTheme();

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    checkAndApplyTheme();
});
