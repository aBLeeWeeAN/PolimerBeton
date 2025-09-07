import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const appsDir = path.resolve("./apps");

fs.readdirSync(appsDir).forEach((appName) => {
    const scssDir = path.join(appsDir, appName, "static", appName, "scss");
    const outDir = path.join(appsDir, appName, "static", appName, "css");

    if (!fs.existsSync(scssDir)) return;
    fs.mkdirSync(outDir, { recursive: true });

    console.log(`[SCSS][${appName}] Watching ${scssDir} -> ${outDir}`);

    // Sass CLI сам игнорирует файлы начинающиеся с '_'
    const proc = spawn("sass", ["--watch", `${scssDir}:${outDir}`, "--no-source-map"], { stdio: "inherit", shell: true });

    proc.on("close", (code) => console.log(`[SCSS][${appName}] Watch stopped with code ${code}`));
});
