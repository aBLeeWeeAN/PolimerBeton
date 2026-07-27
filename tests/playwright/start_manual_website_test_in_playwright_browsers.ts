// * --- start_manual_website_test_in_playwright_browsers.ts
// * -------------------------------------------------------
/* eslint-disable no-console */

import { chromium, firefox, webkit } from 'playwright'

const browserType = process.argv[2]?.toLowerCase()
const url = process.argv[3] || 'http://localhost:3000'

const map: Record<string, typeof chromium> = { chromium, firefox, webkit }
const selected = map[browserType]

if (!selected) {
    console.error(
        `Please specify a browser engine: chromium, firefox, or webkit.\nExample: npm run test:chromium`,
    )
    process.exit(1)
}

;(async () => {
    const browser = await selected.launch({
        // * запуск в графическом окне браузера
        headless: false,
        // ? disable GPU - supported only by chromium
        // args: ['--disable-gpu', '--disable-software-rasterizer'],
    })
    const context = await browser.newContext({ viewport: null })
    const page = await context.newPage()

    try {
        await page.goto(url)
        console.log(`✅\u00A0\u00A0Opened ${browserType} → ${url}`)
    } catch {
        console.warn(
            `⚠️\u00A0\u00A0Failed to navigate to ${url} (server might be down). Leaving empty window open.`,
        )
    }

    console.log('Close the browser window or press Ctrl+C in the terminal to exit.')

    // Ждём закрытия страницы (по нажатию на крестик)
    await new Promise<void>((resolve) => {
        page.on('close', () => {
            console.log('Window closed, exiting...')
            resolve()
        })

        // На всякий случай ещё и context
        context.on('close', () => resolve())
    })

    await browser.close().catch(() => {}) // если уже умер — игнорим
    process.exit(0)
})()
