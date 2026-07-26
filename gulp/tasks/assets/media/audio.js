// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE: ASSISTED BY DEEPSEEK & GOOGLE AI
// ! Logic verified by output results. Maintained by aLeeTheY.
// ! ------------------------------------------------------------

import fs from 'fs/promises'
import gulp from 'gulp'
import path from 'path'
import browserSync from 'browser-sync'
import { spawn } from 'child_process'
import pLimit from 'p-limit'

import { env } from '../../../config/env.js'
import { path as configPath } from '../../../config/path.js'
import { assetExists } from '../../../helpers/asset-exists.js'
import { notify, NOTIFICATION_HANDLER_TITLES } from '../../../helpers/error-handler.js'

const limit = pLimit(4)
const AUDIO_GLOB = configPath.src.audio
const OUT_DIR = path.resolve(configPath.build.audio)

// Проверка инструментов
async function checkToolAvailable(tool) {
    try {
        await spawnPromise(tool, ['-version'], { verbose: false })
    } catch {
        throw new Error(`${tool} is not available.`)
    }
}

// Универсальный spawnPromise с verbose
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

const isAudio = (file) => /\.(mp3|wav|ogg|m4a|flac|aac|opus)$/i.test(file)

async function processFile(filePath) {
    if (!isAudio(filePath)) {
        return { success: false, path: filePath, reason: 'not audio' }
    }

    const RAW_DIR = path.resolve('src/assets/audio')
    const relPath = path.relative(RAW_DIR, filePath)
    const parsed = path.parse(relPath)
    const outDir = path.join(OUT_DIR, parsed.dir)
    const baseName = parsed.name

    const needWebm = !(await assetExists(outDir, baseName, '.webm'))
    const needMp3 = !(await assetExists(outDir, baseName, '.mp3'))

    const webmOut = path.join(outDir, `${baseName}.webm`)
    const mp3Out = path.join(outDir, `${baseName}.mp3`)
    const webmTmp = webmOut + '.tmp'
    const mp3Tmp = mp3Out + '.tmp'

    let processed = false
    try {
        await fs.mkdir(outDir, { recursive: true })

        if (needWebm) {
            await spawnPromise(
                'ffmpeg',
                [
                    '-y',
                    '-i',
                    filePath,
                    '-c:a',
                    'libopus',
                    '-b:a',
                    '96k',
                    '-vbr',
                    'on',
                    '-compression_level',
                    '10',
                    '-f',
                    'webm',
                    webmTmp,
                ],
                { verbose: env.isVerbose },
            )
            await fs.rename(webmTmp, webmOut)
            processed = true
        }

        if (needMp3) {
            await spawnPromise(
                'ffmpeg',
                ['-y', '-i', filePath, '-c:a', 'libmp3lame', '-q:a', '2', '-f', 'mp3', mp3Tmp],
                { verbose: env.isVerbose },
            )
            await fs.rename(mp3Tmp, mp3Out)
            processed = true
        }

        return { success: true, relPath, processed }
    } catch (err) {
        await Promise.allSettled([
            fs.unlink(webmTmp).catch(() => {}),
            fs.unlink(mp3Tmp).catch(() => {}),
        ])
        return { success: false, relPath, error: err.message }
    }
}

export async function audio() {
    await checkToolAvailable('ffmpeg')

    // Сбор файлов через асинхронную итерацию (Gulp 5)
    const files = []
    const stream = gulp.src(AUDIO_GLOB, { allowEmpty: true, read: false })
    for await (const file of stream) {
        files.push(file.path)
    }

    if (files.length === 0) {
        notify.warn(NOTIFICATION_HANDLER_TITLES.AUDIO, 'No audio files found.')
        return
    }

    const results = await Promise.all(files.map((file) => limit(() => processFile(file))))

    const failed = results.filter((r) => !r.success)
    const succeeded = results.filter((r) => r.success)
    const processedCount = succeeded.filter((r) => r.processed).length
    const skippedCount = succeeded.length - processedCount

    if (failed.length > 0) {
        notify.warn(
            NOTIFICATION_HANDLER_TITLES.AUDIO,
            `Audio: ${processedCount} updated, ${skippedCount} skipped, ${failed.length} failed.`,
        )
    } else {
        notify.success(
            NOTIFICATION_HANDLER_TITLES.AUDIO,
            `Audio: ${processedCount} updated, ${skippedCount} skipped.`,
        )
    }

    // * update dev server
    browserSync.reload()
}
gulp.task('audio', audio)
