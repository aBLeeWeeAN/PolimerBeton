export interface BallVariantConfig {
    color: string
    offset: [number, number]
}

export const BALL_VARIANTS: Record<string, BallVariantConfig> = {
    green: { color: '#035332', offset: [8.47, 3.23] },
    yellow: { color: '#905F03', offset: [31.2, 41.3] },
    white: { color: '#878787', offset: [2.84, -0.42] },
    grey: { color: '#414141', offset: [-50.1, -14.2] },
    red: { color: '#81302C', offset: [-1.23, -2.01] },
}

export function getVariantFromElement(el: HTMLElement): BallVariantConfig {
    for (const key of Object.keys(BALL_VARIANTS)) {
        if (
            el.classList.contains(`my-balls-group__3d-model--${key}`) ||
            el.dataset.variant === key
        ) {
            return BALL_VARIANTS[key]
        }
    }
    return BALL_VARIANTS.green
}
