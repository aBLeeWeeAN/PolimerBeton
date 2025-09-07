import fs from "fs";
import path from "path";
import { sync as rimraf } from "rimraf"; // <-- вот так

const appsDir = path.resolve("./apps");

fs.readdirSync(appsDir).forEach((appName) => {
    const appStatic = path.join(appsDir, appName, "static", appName);

    // Папки для очистки
    const foldersToClean = ["css", "js"];

    foldersToClean.forEach((folder) => {
        const dir = path.join(appStatic, folder);
        if (fs.existsSync(dir)) {
            rimraf(dir);
            console.log(`[CLEAN][${appName}] Removed ${dir}`);
        }
    });
});
