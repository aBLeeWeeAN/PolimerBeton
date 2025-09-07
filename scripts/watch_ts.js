import esbuild from "esbuild";
import fs from "fs";
import path from "path";

const appsDir = path.resolve("./apps");

fs.readdirSync(appsDir).forEach((appName) => {
    const tsDir = path.join(appsDir, appName, "static", appName, "ts");
    const jsDir = path.join(appsDir, appName, "static", appName, "js");

    if (!fs.existsSync(tsDir)) return;
    fs.mkdirSync(jsDir, { recursive: true });

    fs.readdirSync(tsDir).forEach((file) => {
        if (!file.endsWith(".ts")) return;

        const src = path.join(tsDir, file);
        const out = path.join(jsDir, file.replace(/\.ts$/, ".js"));

        // Начальная сборка
        esbuild.buildSync({ entryPoints: [src], outfile: out, bundle: true, sourcemap: true });

        console.log(`[TS][${appName}] ${file} built`);

        // watch
        esbuild.build({
            entryPoints: [src],
            outfile: out,
            bundle: true,
            sourcemap: true,
            watch: {
                onRebuild(error) {
                    if (error) console.error(`[TS][${appName}] ${file} rebuild failed`, error);
                    else console.log(`[TS][${appName}] ${file} rebuilt`);
                },
            },
        });
    });
});
