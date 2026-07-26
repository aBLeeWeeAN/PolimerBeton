export function init3dBallsRotation() {
    const viewers = document.querySelectorAll('model-viewer[data-rotate-model]')

    viewers.forEach((el) => {
        // Указываем линтеру, что это "любой" объект, чтобы он разрешил читать нестандартные свойства вроде .model
        /** @type {any} */
        const viewer = el

        let isDragging = false
        let previousX = 0

        const modelOrientation = [0, 0, 0]

        const startDrag = (x) => {
            isDragging = true
            previousX = x
            viewer.removeAttribute('auto-rotate')
        }

        const updateDrag = (x) => {
            if (!isDragging || !viewer.model) {
                return
            }

            const deltaX = x - previousX
            previousX = x

            modelOrientation[1] += deltaX * 0.4
            viewer.model.orientation = `${modelOrientation[0]}deg ${modelOrientation[1]}deg ${modelOrientation[2]}deg`
        }

        const stopDrag = () => {
            if (!isDragging) {
                return
            }
            isDragging = false

            setTimeout(() => {
                viewer.setAttribute('auto-rotate', '')
            }, 1200)
        }

        // НАЖАТИЕ МЫШИ (Явно говорим линтеру, что e — это MouseEvent)
        viewer.addEventListener(
            'mousedown',
            /** @param {MouseEvent} e */ (e) => {
                startDrag(e.clientX)
            },
        )

        // ДВИЖЕНИЕ МЫШИ
        document.addEventListener(
            'mousemove',
            /** @param {MouseEvent} e */ (e) => {
                updateDrag(e.clientX)
            },
        )

        document.addEventListener('mouseup', stopDrag)

        // ТАЧ НА МОБИЛКАХ (Явно говорим линтеру, что e — это TouchEvent)
        viewer.addEventListener(
            'touchstart',
            /** @param {TouchEvent} e */ (e) => {
                if (e.touches.length > 0) {
                    startDrag(e.touches[0].clientX)
                }
            },
        )

        // ДВИЖЕНИЕ ПАЛЬЦА
        document.addEventListener(
            'touchmove',
            /** @param {TouchEvent} e */ (e) => {
                if (e.touches.length > 0) {
                    updateDrag(e.touches[0].clientX)
                }
            },
        )

        document.addEventListener('touchend', stopDrag)
    })
}
