import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const appsDir = path.resolve("./apps");

fs.readdirSync(appsDir).forEach((appName) => {
    const scssDir = path.join(appsDir, appName, "static", appName, "scss");
    const outDir = path.join(appsDir, appName, "static", appName, "css");

    if (!fs.existsSync(scssDir)) return;
    fs.mkdirSync(outDir, { recursive: true });

    fs.readdirSync(scssDir).forEach((file) => {
        if (file.endsWith(".scss") && !file.startsWith("_")) {
            const srcFile = path.join(scssDir, file);
            const outFile = path.join(outDir, file.replace(/\.scss$/, ".css"));
            execSync(`sass --no-source-map "${srcFile}" "${outFile}"`, { stdio: "inherit" });
        }
    });
});
