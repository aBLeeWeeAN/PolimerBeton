// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE: ASSISTED BY DEEPSEEK & GOOGLE AI
// ! Logic verified by output results. Maintained by aLeeTheY.
// ! ------------------------------------------------------------

import fs from 'fs'
import gulp from 'gulp'
import nodePath from 'path'
import browserSync from 'browser-sync'
import { spawn, execSync } from 'child_process'

import { env } from '../../../config/env.js'
import { path } from '../../../config/path.js'
import { assetExists } from '../../../helpers/asset-exists.js'
import { notify, NOTIFICATION_HANDLER_TITLES } from '../../../helpers/error-handler.js'

const RAW = 'src/assets/fonts'
const OUT = path.build.fonts
const REQUIRED_TOOLS = ['ftcli']

// ------------------- Helpers -------------------

async function checkRequiredTools() {
    for (const tool of REQUIRED_TOOLS) {
        try {
            await spawnPromise(tool, ['--version'], { verbose: false })
        } catch {
            throw new Error(
                `CLI tool "${tool}" is not installed or not accessible. Install it globally or as dev dependency.`,
            )
        }
    }
}

function spawnPromise(cmd, args, { verbose = false } = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, {
            stdio: verbose ? 'inherit' : 'pipe',
        })
        let stderr = ''
        if (!verbose) {
            proc.stderr.on('data', (data) => {
                stderr += data
            })
        }
        proc.on('close', (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(stderr || `Command failed with code ${code}`))
            }
        })
        proc.on('error', reject)
    })
}

function getRawFontFiles() {
    if (!fs.existsSync(RAW)) {
        return []
    }
    const files = fs.readdirSync(RAW, { recursive: true, withFileTypes: true })
    return files
        .filter((dirent) => dirent.isFile() && /\.(ttf|otf)$/i.test(dirent.name))
        .map((dirent) => {
            const dirPath = dirent.parentPath || dirent.path || RAW
            return nodePath.relative(RAW, nodePath.join(dirPath, dirent.name))
        })
        .sort()
}

/**
 * Возвращает true, если все целевые форматы шрифта уже существуют в выходной папке
 * (с учётом возможной ревизии).
 */
async function isUpToDate(outBase) {
    const outDir = nodePath.dirname(outBase)
    const baseName = nodePath.basename(outBase)
    const exts = ['.ttf', '.woff', '.woff2']
    const checks = await Promise.all(exts.map((ext) => assetExists(outDir, baseName, ext)))
    return checks.every(Boolean)
}

// ------------------- Font conversion -------------------

async function convertRawFonts() {
    await checkRequiredTools()
    // fs.mkdirSync(OUT, { recursive: true })

    const rawFiles = getRawFontFiles()
    if (rawFiles.length === 0) {
        notify.warn(NOTIFICATION_HANDLER_TITLES.FONTS, 'No fonts to convert.')
        return { updated: 0, skipped: 0, failures: [] }
    }

    let updated = 0
    let skipped = 0
    const failures = []

    for (const relPath of rawFiles) {
        const rawInput = nodePath.join(RAW, relPath)
        const parsed = nodePath.parse(relPath)
        const outDir = nodePath.join(OUT, parsed.dir)
        const outBase = nodePath.join(outDir, parsed.name)

        if (await isUpToDate(outBase)) {
            skipped++
            continue
        }

        try {
            fs.mkdirSync(outDir, { recursive: true })
            const ttfTarget = outBase + '.ttf'

            // OTF → TTF
            if (parsed.ext.toLowerCase() === '.otf') {
                await spawnPromise(
                    'ftcli',
                    ['converter', 'otf2ttf', rawInput, '--output-dir', outDir],
                    { verbose: env.isVerbose },
                )
                const dirty = nodePath.join(outDir, parsed.base + '.ttf')
                if (fs.existsSync(dirty)) {
                    fs.renameSync(dirty, ttfTarget)
                }
            } else if (parsed.ext.toLowerCase() === '.ttf') {
                fs.copyFileSync(rawInput, ttfTarget)
            }

            // TTF → WOFF / WOFF2
            if (fs.existsSync(ttfTarget)) {
                await spawnPromise(
                    'ftcli',
                    ['converter', 'ft2wf', ttfTarget, '--output-dir', outDir, '--overwrite'],
                    { verbose: env.isVerbose },
                )
                for (const wfExt of ['woff', 'woff2']) {
                    const dirty = nodePath.join(outDir, parsed.name + '.ttf.' + wfExt)
                    const clean = nodePath.join(outDir, parsed.name + '.' + wfExt)
                    if (fs.existsSync(dirty)) {
                        fs.renameSync(dirty, clean)
                    }
                }
            }

            updated++
        } catch (err) {
            failures.push({ file: relPath, error: err.message })
            notify.warn(NOTIFICATION_HANDLER_TITLES.FONTS, `Failed: ${relPath}`)
        }
    }

    // Сводка как в audio/video
    if (failures.length > 0) {
        notify.warn(
            NOTIFICATION_HANDLER_TITLES.FONTS,
            `Fonts: ${updated} updated, ${skipped} skipped, ${failures.length} failed.`,
        )
    } else {
        notify.success(
            NOTIFICATION_HANDLER_TITLES.FONTS,
            `Fonts: ${updated} updated, ${skipped} skipped.`,
        )
    }

    return { updated, skipped, failures }
}

// ------------------- SCSS generation -------------------

function parseFontMetadata(fileNameWithoutExt) {
    const tokens = fileNameWithoutExt.split('-')
    let style = 'normal'
    let weight = 400

    const weightMap = {
        thin: 100,
        extralight: 200,
        light: 300,
        regular: 400,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
    }

    let styleFound = false,
        weightFound = false
    for (let i = tokens.length - 1; i >= 0; i--) {
        const token = tokens[i].toLowerCase()
        if (
            !styleFound &&
            (token === 'italic' ||
                token === 'oblique' ||
                token.endsWith('italic') ||
                token.endsWith('oblique'))
        ) {
            style = 'italic'
            styleFound = true
            tokens.splice(i, 1)
            continue
        }
        if (!weightFound && weightMap[token]) {
            weight = weightMap[token]
            weightFound = true
            tokens.splice(i, 1)
            continue
        }
        if (styleFound && weightFound) {
            break
        }
    }
    const family = tokens.join('-').replace(/-+$/, '')
    return { family, weight, style }
}

function generateFontFaceSCSS() {
    // Если папка OUT не существует (нет сконвертированных шрифтов), просто выходим
    if (!fs.existsSync(OUT)) {
        return
    }

    fs.mkdirSync('src/scss/base', { recursive: true })

    const outFiles = fs
        .readdirSync(OUT, { recursive: true, withFileTypes: true })
        .filter((d) => d.isFile() && /\.(woff2?|ttf)$/i.test(d.name))
        .map((d) => {
            const dirPath = d.parentPath || d.path || OUT
            return nodePath.relative(OUT, nodePath.join(dirPath, d.name))
        })
        .sort()

    if (outFiles.length === 0) {
        notify.warn(NOTIFICATION_HANDLER_TITLES.FONTS, 'No output fonts, skipping SCSS.')
        return
    }

    const families = {}
    for (const relPath of outFiles) {
        const fileName = nodePath.basename(relPath)
        const ext = nodePath.extname(fileName).slice(1).toLowerCase()
        const nameWithoutExt = nodePath.basename(fileName, nodePath.extname(fileName))
        const { family, weight, style } = parseFontMetadata(nameWithoutExt)
        const key = `${family}__${weight}__${style}`
        if (!families[key]) {
            families[key] = { family, weight, style, formats: [] }
        }
        families[key].formats.push({ ext, relPath })
    }

    const priority = { woff2: 1, woff: 2, ttf: 3 }
    for (const key of Object.keys(families)) {
        families[key].formats.sort((a, b) => (priority[a.ext] || 99) - (priority[b.ext] || 99))
    }

    const newOfflineBlock = ['// ! --- OFFLINE FONTS', '// ! -----------------', '']
    for (const key of Object.keys(families).sort()) {
        const { family, weight, style, formats } = families[key]
        const srcParts = formats.map((f) => {
            const formatStr = f.ext === 'ttf' ? 'truetype' : f.ext
            const cssPath = f.relPath.split(nodePath.sep).join('/')
            return `    url('../assets/fonts/${cssPath}') format('${formatStr}')`
        })
        newOfflineBlock.push(`@font-face {`)
        newOfflineBlock.push(`    font-family: '${family}';`)
        newOfflineBlock.push(`    font-weight: ${weight};`)
        newOfflineBlock.push(`    font-style: ${style};`)
        newOfflineBlock.push(`    font-display: swap;`)
        newOfflineBlock.push(`    src:`)
        newOfflineBlock.push(srcParts.join(',\n'))
        newOfflineBlock.push(`    ;`)
        newOfflineBlock.push(`}`)
        newOfflineBlock.push('')
    }

    const scssPath = 'src/scss/base/_fonts.scss'
    const marker = '// ! --- OFFLINE FONTS'
    let existingContent = fs.existsSync(scssPath) ? fs.readFileSync(scssPath, 'utf8') : ''
    const finalContent = existingContent.includes(marker)
        ? existingContent.substring(0, existingContent.indexOf(marker)) + newOfflineBlock.join('\n')
        : ['// ! --- ONLINE FONTS', '// ! ----------------', '', ...newOfflineBlock].join('\n')

    fs.writeFileSync(scssPath, finalContent)
    notify.success(
        NOTIFICATION_HANDLER_TITLES.FONTS,
        `_fonts.scss updated (${outFiles.length} files).`,
    )

    try {
        execSync(`prettier --write "${scssPath}"`, { stdio: 'ignore' })
    } catch (err) {
        notify.warn(NOTIFICATION_HANDLER_TITLES.FONTS, `Prettier failed: ${err.message}`)
    }
}

// ------------------- Main Gulp task -------------------

export async function fonts() {
    await convertRawFonts()
    generateFontFaceSCSS()

    // * стримим шрифты в BrowserSync только если папка существует
    if (fs.existsSync(OUT)) {
        return gulp
            .src(`${OUT}/**/*.{woff,woff2,ttf}`, { allowEmpty: true })
            .on('end', () => browserSync.reload())
    }
    // * если шрифтов нет, просто перезагружаем браузер
    browserSync.reload()
}

gulp.task('fonts', fonts)
