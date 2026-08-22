// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE: ASSISTED BY DEEPSEEK & GOOGLE AI
// ! Logic verified by output results. Maintained by aLeeTheY.
// ! ------------------------------------------------------------
/* eslint-disable no-console */

import path from 'path'
import fs from 'fs/promises'
import through2 from 'through2'
import render from 'dom-serializer'
import { DomHandler, Element } from 'domhandler'
import { Parser } from 'htmlparser2'
import * as DomUtils from 'domutils'
import sharp from 'sharp'

const IMAGE_GENERATION_SIZES = {
    // desktop: 1440,
    // laptop: 1024,
    // tablet: 768,
    // mobile: 320,
}

const FORMATS = ['image/avif', 'image/webp', 'image/jpeg', 'image/png']

export function htmlImg2PictureTransformer(assetsSrcDir, options = {}) {
    const config = {
        desktopFirst: true,
        setDimensions: false, // Проставлять width и height
        setLazyLoading: false, // Автоматически добавлять loading="lazy"
        setAsyncDecoding: false, // Добавлять decoding="async"
        ...options,
    }

    const MEDIA_BREAKPOINTS = config.desktopFirst
        ? { mobile: 479, tablet: 767, laptop: 1023, desktop: 1439 }
        : { mobile: 320, tablet: 768, laptop: 1024, desktop: 1440 }

    return through2.obj(function (file, enc, callback) {
        if (file.isNull()) {
            return callback(null, file)
        }
        if (file.isStream()) {
            return callback(new Error('Streaming not supported'))
        }

        const asyncWork = async () => {
            const htmlContent = file.contents.toString()
            const handler = new DomHandler()
            const parser = new Parser(handler)
            parser.write(htmlContent)
            parser.end()
            const dom = handler.dom

            const images = DomUtils.getElementsByTagName('img', dom)

            for (const img of images) {
                const src = img.attribs.src

                if (
                    !src ||
                    src.match(/\.(svg|gif)$/i) ||
                    src.startsWith('http') ||
                    src.startsWith('data:')
                ) {
                    continue
                }
                if (!src.includes('@images/')) {
                    continue
                }

                const match = src.match(/(.*)\.(jpg|jpeg|png)$/i)
                if (!match) {
                    continue
                }

                const [, basePath, originalExt] = match
                const isPng = originalExt.toLowerCase() === 'png'

                const relativeImgPath = src.replace(/.*@images\//, '')
                const absoluteImgPath = path.join(assetsSrcDir, relativeImgPath)

                let originalWidth = null
                let metadata = null

                try {
                    await fs.access(absoluteImgPath)
                    metadata = await sharp(absoluteImgPath).metadata()
                    originalWidth = metadata.width
                } catch (err) {
                    console.warn(
                        `[html-transformer] File not found: ${absoluteImgPath}\tError message: ${err}`,
                    )
                }

                const allowedMimeTypes = FORMATS.filter((mime) => {
                    if (mime === 'image/jpeg' && isPng) {
                        return false
                    }
                    if (mime === 'image/png' && !isPng) {
                        return false
                    }
                    return true
                })

                const picture = new Element('picture', {})

                if (img.attribs['data-my-picture-class']) {
                    picture.attribs.class = img.attribs['data-my-picture-class']
                }

                const setupFallbackImg = (baseImg) => {
                    const clone = baseImg.cloneNode(true)

                    // Всегда подчищаем служебный атрибут обертки
                    if (clone.attribs['data-my-picture-class']) {
                        delete clone.attribs['data-my-picture-class']
                    }

                    clone.attribs.src = config.desktopFirst
                        ? src
                        : `${basePath}-mobile.${originalExt}`

                    // 1. Установка loading="lazy" по флагу
                    if (config.setLazyLoading) {
                        if (clone.attribs.fetchpriority === 'high') {
                            delete clone.attribs.loading
                        } else if (!clone.attribs.loading) {
                            clone.attribs.loading = 'lazy'
                        }
                    }

                    // 2. Установка decoding="async" по флагу
                    if (config.setAsyncDecoding && !clone.attribs.decoding) {
                        clone.attribs.decoding = 'async'
                    }

                    // 3. Простановка размеров по флагу
                    if (config.setDimensions && originalWidth && metadata?.height) {
                        clone.attribs.width = String(originalWidth)
                        clone.attribs.height = String(metadata.height)
                    }

                    return clone
                }

                // --- СЦЕНАРИЙ 1: Картинка меньше минимального лимита ---
                if (originalWidth && originalWidth <= IMAGE_GENERATION_SIZES.mobile) {
                    allowedMimeTypes.forEach((mimeType) => {
                        const ext = mimeType.split('/')[1]
                        if (ext === originalExt.toLowerCase()) {
                            return
                        }

                        const source = new Element('source', {
                            type: mimeType,
                            srcset: `${basePath}.${ext}`,
                        })
                        DomUtils.appendChild(picture, source)
                    })

                    const imgClone = setupFallbackImg(img)
                    DomUtils.appendChild(picture, imgClone)
                    DomUtils.replaceElement(img, picture)
                    continue
                }

                // --- СЦЕНАРИЙ 2: Адаптивное изображение ---
                const activeBreakpoints = []

                if (config.desktopFirst) {
                    if (!originalWidth || originalWidth > IMAGE_GENERATION_SIZES.mobile) {
                        activeBreakpoints.push({
                            suffix: '-mobile',
                            queryVal: MEDIA_BREAKPOINTS.mobile,
                        })
                    }
                    if (originalWidth && originalWidth > IMAGE_GENERATION_SIZES.tablet) {
                        activeBreakpoints.push({
                            suffix: '-tablet',
                            queryVal: MEDIA_BREAKPOINTS.tablet,
                        })
                    }
                    if (originalWidth && originalWidth > IMAGE_GENERATION_SIZES.laptop) {
                        activeBreakpoints.push({
                            suffix: '-laptop',
                            queryVal: MEDIA_BREAKPOINTS.laptop,
                        })
                    }
                    if (originalWidth && originalWidth > IMAGE_GENERATION_SIZES.desktop) {
                        activeBreakpoints.push({
                            suffix: '-desktop',
                            queryVal: MEDIA_BREAKPOINTS.desktop,
                        })
                    }
                    activeBreakpoints.sort((a, b) => a.queryVal - b.queryVal)
                } else {
                    if (!originalWidth || originalWidth > IMAGE_GENERATION_SIZES.mobile) {
                        activeBreakpoints.push({
                            suffix: '-mobile',
                            queryVal: MEDIA_BREAKPOINTS.mobile,
                        })
                    }
                    if (originalWidth && originalWidth > IMAGE_GENERATION_SIZES.tablet) {
                        activeBreakpoints.push({
                            suffix: '-tablet',
                            queryVal: MEDIA_BREAKPOINTS.tablet,
                        })
                    }
                    if (originalWidth && originalWidth > IMAGE_GENERATION_SIZES.laptop) {
                        activeBreakpoints.push({
                            suffix: '-laptop',
                            queryVal: MEDIA_BREAKPOINTS.laptop,
                        })
                    }
                    if (originalWidth && originalWidth > IMAGE_GENERATION_SIZES.desktop) {
                        activeBreakpoints.push({
                            suffix: '-desktop',
                            queryVal: MEDIA_BREAKPOINTS.desktop,
                        })
                    }

                    let closestBreakpoint = MEDIA_BREAKPOINTS.mobile
                    if (originalWidth) {
                        const smallerSizes = Object.values(IMAGE_GENERATION_SIZES).filter(
                            (w) => w < originalWidth,
                        )
                        if (smallerSizes.length > 0) {
                            const maxGeneratedSize = Math.max(...smallerSizes)
                            const bpKey = Object.keys(IMAGE_GENERATION_SIZES).find(
                                (key) => IMAGE_GENERATION_SIZES[key] === maxGeneratedSize,
                            )
                            if (bpKey && MEDIA_BREAKPOINTS[bpKey]) {
                                closestBreakpoint = MEDIA_BREAKPOINTS[bpKey]
                            }
                        }
                    }
                    activeBreakpoints.push({ suffix: '', queryVal: closestBreakpoint })
                    activeBreakpoints.sort((a, b) => b.queryVal - a.queryVal)
                }

                const mediaQueryType = config.desktopFirst ? 'max-width' : 'min-width'

                allowedMimeTypes.forEach((mimeType) => {
                    const ext = mimeType.split('/')[1]

                    activeBreakpoints.forEach((bp) => {
                        if (!config.desktopFirst && bp.suffix === '') {
                            return
                        }

                        const source = new Element('source', {
                            type: mimeType,
                            media: `(${mediaQueryType}: ${bp.queryVal}px)`,
                            srcset: `${basePath}${bp.suffix}.${ext}`,
                        })
                        DomUtils.appendChild(picture, source)
                    })
                })

                if (config.desktopFirst) {
                    allowedMimeTypes.forEach((mimeType) => {
                        const ext = mimeType.split('/')[1]
                        if (ext === originalExt.toLowerCase()) {
                            return
                        }

                        const source = new Element('source', {
                            type: mimeType,
                            srcset: `${basePath}.${ext}`,
                        })
                        DomUtils.appendChild(picture, source)
                    })
                } else {
                    const origBp = activeBreakpoints.find((bp) => bp.suffix === '')
                    if (origBp) {
                        allowedMimeTypes.forEach((mimeType) => {
                            const ext = mimeType.split('/')[1]
                            if (ext === originalExt.toLowerCase()) {
                                return
                            }

                            const source = new Element('source', {
                                type: mimeType,
                                media: `(${mediaQueryType}: ${origBp.queryVal}px)`,
                                srcset: `${basePath}.${ext}`,
                            })
                            DomUtils.appendChild(picture, source)
                        })

                        const originalMime = `image/${originalExt.toLowerCase()}`
                        const origSource = new Element('source', {
                            type: originalMime,
                            media: `(${mediaQueryType}: ${origBp.queryVal}px)`,
                            srcset: `${basePath}.${originalExt}`,
                        })
                        DomUtils.appendChild(picture, origSource)
                    }
                }

                const imgClone = setupFallbackImg(img)

                DomUtils.appendChild(picture, imgClone)
                DomUtils.replaceElement(img, picture)
            }

            file.contents = Buffer.from(render(dom, { decodeEntities: false }))
        }

        asyncWork()
            .then(() => callback(null, file))
            .catch((err) => callback(err))
    })
}
