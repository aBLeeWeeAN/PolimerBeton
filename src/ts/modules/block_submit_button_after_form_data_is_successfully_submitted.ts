export function initSubmitButtonBlock() {
    const form = document.getElementById('my-feedback-form') as HTMLFormElement | null
    const submitButton = document.getElementById(
        'my-feedback-form-submit-button',
    ) as HTMLInputElement | null

    // Защита: если на этой странице нет формы или кнопки отправки, тихо выходим.
    // Больше никакой JS не упадет в обморок из-за отсутствующих элементов!
    if (!form || !submitButton) {
        return
    }

    // Фиксируем типы для TypeScript, чтобы намертво убрать подозрения на 'possibly null'
    const formEl: HTMLFormElement = form
    const button: HTMLInputElement = submitButton

    const originalText = button.value
    let dots = 0
    let interval: ReturnType<typeof setInterval> | undefined

    formEl.addEventListener('submit', (event) => {
        // Предотвращаем повторную отправку, если кнопка уже заблокирована
        if (button.disabled) {
            event.preventDefault()
            return
        }

        button.disabled = true

        // Запускаем анимацию текста ("Отправка.", "Отправка..", "Отправка...")
        interval = setInterval(() => {
            dots = (dots + 1) % 4
            button.value = originalText + '.'.repeat(dots)
        }, 300)

        // Имитируем задержку до завершения отправки формы
        setTimeout(() => {
            if (interval) {
                clearInterval(interval)
            }
            button.value = 'Отправлено'
        }, 1000)
    })
}
