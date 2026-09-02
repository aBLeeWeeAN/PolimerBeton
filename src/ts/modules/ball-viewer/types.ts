export interface BallVariantConfig {
    color: string
    offset: [number, number]
}

export const BALL_VARIANTS: Record<string, BallVariantConfig> = {
    green: { color: '#005514', offset: [-2.4, -16.92] },
    yellow: { color: '#A75000', offset: [-3.1, 2.58] },
    white: { color: '#857272', offset: [-24.2, -0.42] },
    grey: { color: '#3B2E2E', offset: [0, -0.62] },
    red: { color: '#850303', offset: [-7.0, -29.42] },
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
