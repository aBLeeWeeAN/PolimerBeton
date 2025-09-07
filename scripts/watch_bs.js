import browserSync from "browser-sync";

const bs = browserSync.create();

// Следим за всеми CSS/JS/HTML файлами
const watchFiles = ["apps/**/static/**/*.css", "apps/**/static/**/*.js", "apps/**/templates/**/*.html"];

bs.init({
    proxy: "127.0.0.1:8000", // Django dev server
    port: 3000,
    browser: "chrome",
    open: true,
    notify: false,
    files: watchFiles,
    watchOptions: {
        usePolling: true, // Windows polling
        interval: 100,
    },
});
