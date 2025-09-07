import { execSync } from "node:child_process";
import { globSync } from "glob";
import { dirname } from "node:path";
import { mkdirSync } from "node:fs";

function run(cmd) {
    console.log(">", cmd);
    execSync(cmd, { stdio: "inherit" });
}

// Build TypeScript → JS
export function buildTs(watch = false) {
    const files = globSync("apps/*/static/*/ts/**/*.ts");
    files.forEach((file) => {
        const outdir = dirname(file).replace("\\ts", "\\js").replace("/ts", "/js");
        mkdirSync(outdir, { recursive: true }); // создаём папку, если нет
        let cmd = `esbuild "${file}" --bundle --outdir="${outdir}" --minify`;
        if (watch) cmd += " --watch";
        run(cmd);
    });
}

// Build SCSS → CSS
export function buildScss(watch = false) {
    const dirs = globSync("apps/*/static/*/scss");
    dirs.forEach((dir) => {
        const outdir = dir.replace("\\scss", "\\css").replace("/scss", "/css");
        mkdirSync(outdir, { recursive: true });
        let cmd = `sass ${watch ? "--watch " : ""}"${dir}":"${outdir}" --style=compressed --no-source-map`;
        run(cmd);
    });
}

// CLI
const task = process.argv[2];
if (task === "ts") buildTs();
if (task === "scss") buildScss();
if (task === "ts:watch") buildTs(true);
if (task === "scss:watch") buildScss(true);
