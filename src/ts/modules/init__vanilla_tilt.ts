import VanillaTilt, { TiltOptions } from 'vanilla-tilt'

interface ExtendedHTMLElement extends HTMLElement {
    vanillaTilt?: {
        settings: TiltOptions & { scale: number }
    }
}

export function initVanillaTilt() {
    // ! если юзер отключил анимации -> запретить инициализацию vanilla-tilt
    // todo: можно сделать через listener, а не как init-вариант
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        return
    }

    const vanillaTiltOptions = {
        // * reverse the tilt direction
        'reverse': true,
        // * max tilt rotation (degrees)
        'max': 7,
        // * the starting tilt on the X axis, in degrees.
        'startX': 0,
        // * the starting tilt on the Y axis, in degrees.
        'startY': 0,
        // * Transform perspective, the lower the more extreme the tilt gets.
        'perspective': 1000,
        // * 2 = 200%, 1.5 = 150%, etc..
        'scale': 1,
        // 'scale': 'var(--my-scale, 1)',
        // * Speed of the enter/exit transition
        'speed': 300,
        // * Set a transition on enter/exit.
        'transition': true,
        // * What axis should be enabled. Can be "x" or "y".
        'axis': null,
        // * If the tilt effect has to be reset on exit.
        'reset': true,
        // * Whether the exit reset will go to [0,0] (default) or [startX, startY]
        'reset-to-start': true,
        // * Easing on enter/exit.
        'easing': 'cubic-bezier(.03,.98,.52,.99)',
        // * if it should have a "glare" effect
        'glare': false,
        // * the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
        'max-glare': 1,
        // * false = VanillaTilt creates the glare elements for you, otherwise
        // * you need to add .js-tilt-glare>.js-tilt-glare-inner by yourself
        'glare-prerender': false,
        // * css-selector or link to an HTML-element that will be listening to mouse events
        'mouse-event-element': null,
        // * If true, parallax effect will listen to mouse move events on the whole document, not only the selected element
        'full-page-listening': false,
        // * Boolean to enable/disable device orientation detection,
        'gyroscope': false,
        // * This is the bottom limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the left border of the element;
        'gyroscopeMinAngleX': -45,
        // * This is the top limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the right border of the element;
        'gyroscopeMaxAngleX': 45,
        // * This is the bottom limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the top border of the element;
        'gyroscopeMinAngleY': -45,
        // * This is the top limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the bottom border of the element;
        'gyroscopeMaxAngleY': 45,
        // * How many gyroscope moves to decide the starting position.
        'gyroscopeSamples': 10,
    } as unknown as TiltOptions

    const tiltElements = Array.from(document.querySelectorAll('.js-tilt')) as ExtendedHTMLElement[]
    tiltElements.forEach((element) => {
        // Находим родительский контейнер, который будет слушать мышь
        const parentContainer = element.parentElement

        // Определяем, кто именно слушает мышь
        const trackingElement = parentContainer ? parentContainer : element

        // Создаем индивидуальные опции для этого элемента
        const elementOptions = {
            ...vanillaTiltOptions,

            // Если родитель есть, мышь отслеживаем по нему, иначе по самому элементу
            'mouse-event-element': trackingElement,
        } as unknown as TiltOptions

        // Инициализируем конкретный элемент
        VanillaTilt.init(element, elementOptions)

        // Определяем, кого именно поднимать в иерархии
        const captionContainer = element.closest(
            '.my-gradient-image__caption-container',
        ) as HTMLElement

        const targetToElevate = captionContainer
            ? captionContainer
            : parentContainer
              ? parentContainer
              : element

        // * Создаем переменную для хранения нашего таймера
        let zIndexTimeout: ReturnType<typeof setTimeout> | null = null

        // Вешаем события на trackingElement, а не на сам element!
        trackingElement.addEventListener('mousemove', () => {
            if (zIndexTimeout) {
                clearTimeout(zIndexTimeout)
                zIndexTimeout = null
            }
            targetToElevate.style.position = 'relative'
            targetToElevate.style.zIndex = '100'
        })

        trackingElement.addEventListener('mouseleave', () => {
            // ! обязательно добавляем небольшую задержку (таймаут),
            // ! чтобы z-index не падал быстрее, чем закончится анимация возврата VanillaTilt

            // * ждем столько же, сколько длится transition + 50ms (350ms)
            // * Записываем таймер в переменную, чтобы его можно было отменить
            zIndexTimeout = setTimeout(
                () => {
                    targetToElevate.style.zIndex = '0'
                },
                (vanillaTiltOptions.speed ? vanillaTiltOptions.speed : 0) + 50,
            )
        })

        // ! anti-pattern
        // // * действия при клике
        // element.addEventListener('click', (e) => {
        //     if (element.tagName === 'A' && element.hasAttribute('href')) {
        //         const href = element.getAttribute('href') || ''
        //         const target = element.getAttribute('target') || '_self'

        //         if (target === '_blank') {
        //             // ! УБИРАЕМ e.preventDefault() и setTimeout для _blank !
        //             // Иначе на iPhone и в Safari новая вкладка просто не откроется
        //             return // Позволяем браузеру открыть ссылку стандартно и мгновенно
        //         }

        //         // * А вот для _self (в текущем окне) задержка работает отлично
        //         e.preventDefault()
        //         setTimeout(() => {
        //             window.location.href = href
        //         }, 350)
        //     }
        // })
    })
}
