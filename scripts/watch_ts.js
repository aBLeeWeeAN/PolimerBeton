import { build } from "esbuild";
import fs from "fs";
import path from "path";

const appsDir = path.resolve("./apps");

fs.readdirSync(appsDir).forEach((appName) => {
    const tsDir = path.join(appsDir, appName, "static", appName, "ts");
    const outDir = path.join(appsDir, appName, "static", appName, "js");

    if (!fs.existsSync(tsDir)) return;
    fs.mkdirSync(outDir, { recursive: true });

    fs.readdirSync(tsDir).forEach((file) => {
        if (file.endsWith(".ts")) {
            build({
                entryPoints: [path.join(tsDir, file)],
                bundle: true,
                outfile: path.join(outDir, file.replace(/\.ts$/, ".js")),
                minify: false,
                sourcemap: true,
                watch: {
                    onRebuild(error) {
                        if (error) console.error(`[TS][${appName}] Build failed:`, error);
                        else console.log(`[TS][${appName}] Build succeeded`);
                    },
                },
            }).catch(() => process.exit(1));
        }
    });
});
