// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE: ASSISTED BY DEEPSEEK & GOOGLE AI
// ! Logic verified by output results. Maintained by aLeeTheY.
// ! ------------------------------------------------------------

import fs from 'fs/promises'
import gulp from 'gulp'
import path from 'path'
import browserSync from 'browser-sync'
import { spawn, spawnSync } from 'child_process'
import pLimit from 'p-limit'

import { env } from '../../../config/env.js'
import { path as configPath } from '../../../config/path.js'
import { assetExists } from '../../../helpers/asset-exists.js'
import { notify, NOTIFICATION_HANDLER_TITLES } from '../../../helpers/error-handler.js'

const limit = pLimit(3)
const VIDEOS_GLOB = configPath.src.videos
const OUT_DIR = path.resolve(configPath.build.videos)

async function checkToolAvailable(tool) {
    try {
        await spawnPromise(tool, ['-version'], { verbose: false })
    } catch {
        throw new Error(`${tool} is not available.`)
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

const hasNvenc = (() => {
    try {
        const res = spawnSync('ffmpeg', ['-hide_banner', '-encoders'], {
            encoding: 'utf8',
            timeout: 3000,
        })
        return res.stdout.includes('h264_nvenc') || res.stdout.includes('hevc_nvenc')
    } catch {
        return false
    }
})()

const isVideo = (file) => /\.(mp4|mov|avi|mkv|webm|flv|m4v)$/i.test(file)

async function processFile(filePath) {
    if (!isVideo(filePath)) {
        return { success: false, path: filePath, reason: 'not video' }
    }

    const RAW_DIR = path.resolve('src/assets/videos')
    const relPath = path.relative(RAW_DIR, filePath)
    const parsed = path.parse(relPath)
    const outDir = path.join(OUT_DIR, parsed.dir)
    const baseName = parsed.name

    const needWebm = !(await assetExists(outDir, baseName, '.webm'))
    const needMp4 = !(await assetExists(outDir, baseName, '.mp4'))

    const mp4Out = path.join(outDir, `${baseName}.mp4`)
    const webmOut = path.join(outDir, `${baseName}.webm`)
    const mp4Tmp = mp4Out + '.tmp'
    const webmTmp = webmOut + '.tmp'

    let processed = false
    try {
        await fs.mkdir(outDir, { recursive: true })

        if (needMp4) {
            const mp4Args = hasNvenc
                ? [
                      '-y',
                      '-i',
                      filePath,
                      '-c:v',
                      'h264_nvenc',
                      '-preset',
                      'p4',
                      '-tune',
                      'hq',
                      '-cq',
                      '24',
                      '-rc',
                      'vbr',
                      '-maxrate',
                      '8M',
                      '-bufsize',
                      '16M',
                      '-movflags',
                      '+faststart',
                      '-c:a',
                      'aac',
                      '-b:a',
                      '128k',
                      '-f',
                      'mp4',
                      mp4Tmp,
                  ]
                : [
                      '-y',
                      '-i',
                      filePath,
                      '-c:v',
                      'libx264',
                      '-crf',
                      '24',
                      '-preset',
                      'medium',
                      '-maxrate',
                      '8M',
                      '-bufsize',
                      '16M',
                      '-movflags',
                      '+faststart',
                      '-c:a',
                      'aac',
                      '-b:a',
                      '128k',
                      '-f',
                      'mp4',
                      mp4Tmp,
                  ]

            await spawnPromise('ffmpeg', mp4Args, { verbose: env.isVerbose })
            await fs.rename(mp4Tmp, mp4Out)
            processed = true
        }

        if (needWebm) {
            await spawnPromise(
                'ffmpeg',
                [
                    '-y',
                    '-i',
                    filePath,
                    '-c:v',
                    'libvpx-vp9',
                    '-crf',
                    '31',
                    '-b:v',
                    '0',
                    '-deadline',
                    'good',
                    '-cpu-used',
                    '2',
                    '-row-mt',
                    '1',
                    '-c:a',
                    'libopus',
                    '-b:a',
                    '128k',
                    '-f',
                    'webm',
                    webmTmp,
                ],
                { verbose: env.isVerbose },
            )
            await fs.rename(webmTmp, webmOut)
            processed = true
        }

        return { success: true, relPath, processed }
    } catch (err) {
        await Promise.allSettled([
            fs.unlink(mp4Tmp).catch(() => {}),
            fs.unlink(webmTmp).catch(() => {}),
        ])
        return { success: false, relPath, error: err.message }
    }
}

export async function videos() {
    await checkToolAvailable('ffmpeg')

    const files = []
    const stream = gulp.src(VIDEOS_GLOB, { allowEmpty: true, read: false })
    for await (const file of stream) {
        files.push(file.path)
    }

    if (files.length === 0) {
        notify.warn(NOTIFICATION_HANDLER_TITLES.VIDEOS, 'No video files found.')
        return
    }

    const results = await Promise.all(files.map((file) => limit(() => processFile(file))))

    const failed = results.filter((r) => !r.success)
    const succeeded = results.filter((r) => r.success)
    const processedCount = succeeded.filter((r) => r.processed).length
    const skippedCount = succeeded.length - processedCount

    if (failed.length > 0) {
        notify.warn(
            NOTIFICATION_HANDLER_TITLES.VIDEOS,
            `Videos: ${processedCount} updated, ${skippedCount} skipped, ${failed.length} failed.`,
        )
    } else {
        const enc = hasNvenc ? ' (NVENC)' : ' (CPU)'
        notify.success(
            NOTIFICATION_HANDLER_TITLES.VIDEOS,
            `Videos${enc}: ${processedCount} updated, ${skippedCount} skipped.`,
        )
    }

    // * update dev server
    browserSync.reload()
}
gulp.task('videos', videos)
