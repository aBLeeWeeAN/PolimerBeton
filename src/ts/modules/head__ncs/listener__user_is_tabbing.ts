export function initUserIsTabbingListener() {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
            document.documentElement.classList.add('user-is-tabbing')
        }
    })

    document.addEventListener('pointerdown', () => {
        document.documentElement.classList.remove('user-is-tabbing')
    })
}
