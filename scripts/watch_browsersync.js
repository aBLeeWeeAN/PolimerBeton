import browserSync from "browser-sync";

const bs = browserSync.create();

// Массив путей (не строка с запятой)
const watchFiles = ["apps/**/static/**/*.css", "apps/**/static/**/*.js", "apps/**/templates/**/*.html"];

bs.init({
    proxy: "127.0.0.1:8000",
    files: watchFiles,
    open: false,
    notify: false,
    reloadDelay: 100,
    watchOptions: {
        usePolling: true, // 🔑 заставляет Windows опрашивать изменения
        interval: 100, // проверять каждые 100 мс
    },
});
