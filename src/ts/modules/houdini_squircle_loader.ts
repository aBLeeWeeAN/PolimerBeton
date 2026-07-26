/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

export async function initHoudiniSquircle() {
    try {
        const ua = navigator.userAgent.toLowerCase()
        const isFirefox = ua.includes('firefox')
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

        if (isFirefox || isSafari) {
            console.log(
                'Houdini Squircle не поддерживается в Firefox и Safari. Скрипт не загружается.',
            )
            return
        }

        if ('paintWorklet' in CSS) {
            // 1. Грузим модуль
            await (CSS as any).paintWorklet.addModule(
                'https://www.unpkg.com/css-houdini-squircle/squircle.min.js',
            )

            // 2. СИГНАЛ: Говорим всему документу, что супер-скругление готово
            document.documentElement.classList.add('houdini-squircle-ready')

            console.log('Paint Worklet module (Squircle) успешно загружен')
        } else {
            console.log('Paint Worklet не поддерживается в этом браузере.')
        }
    } catch (error) {
        console.error('Ошибка при загрузке Squircle:', error)
    }
}
