import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const appsDir = path.resolve("./apps");

fs.readdirSync(appsDir).forEach((appName) => {
    const scssDir = path.join(appsDir, appName, "static", appName, "scss");
    const cssDir = path.join(appsDir, appName, "static", appName, "css");

    if (!fs.existsSync(scssDir)) return;
    fs.mkdirSync(cssDir, { recursive: true });

    console.log(`[SCSS][${appName}] Watching ${scssDir} -> ${cssDir}`);

    // Используем sass CLI с опцией polling, чтобы Windows точно ловил изменения
    const proc = spawn("sass", ["--watch", `${scssDir}:${cssDir}`, "--no-source-map", "--poll"], { stdio: "inherit", shell: true });

    proc.on("close", (code) => console.log(`[SCSS][${appName}] Watch stopped with code ${code}`));
});
