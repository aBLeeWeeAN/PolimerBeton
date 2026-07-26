// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE: ASSISTED BY DEEPSEEK & GOOGLE AI
// ! Logic verified by output results. Maintained by aLeeTheY.
// ! ------------------------------------------------------------

import { readdirSync } from 'fs'

/**
 * Проверяет, существует ли в `dir` файл с базовым именем `baseName` и расширением `ext`
 * (регистронезависимо). Учитывает возможный хеш ревизии: baseName.ext или baseName-<hash>.ext.
 */
export function assetExists(dir, baseName, ext) {
    try {
        const files = readdirSync(dir)
        const lowerBase = baseName.toLowerCase()
        const lowerExt = ext.toLowerCase()
        return files.some((file) => {
            const lowerFile = file.toLowerCase()
            if (!lowerFile.endsWith(lowerExt)) {
                return false
            }
            const nameWithoutExt = lowerFile.slice(0, -lowerExt.length)
            return nameWithoutExt === lowerBase || nameWithoutExt.startsWith(lowerBase + '-')
        })
    } catch {
        return false
    }
}

/**
 * Проверяет, существует ли в `dir` хотя бы один файл, чьё имя без расширения
 * совпадает с `baseName` или начинается с `baseName-` (регистронезависимо).
 * Используется для семейств изображений (main_image.avif, main_image-mobile.webp и т.д.).
 */
export function assetFamilyExists(dir, baseName) {
    try {
        const files = readdirSync(dir)
        const lowerBase = baseName.toLowerCase()
        return files.some((fileName) => {
            const lastDot = fileName.lastIndexOf('.')
            const nameWithoutExt =
                lastDot > 0 ? fileName.substring(0, lastDot).toLowerCase() : fileName.toLowerCase()
            return nameWithoutExt === lowerBase || nameWithoutExt.startsWith(lowerBase + '-')
        })
    } catch {
        return false
    }
}
