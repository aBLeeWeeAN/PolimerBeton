// * --- VENDORS SCRIPTS
// * -------------------
import '@google/model-viewer'
import 'bootstrap'

// * --- MY SCRIPTS
// * --------------
import { initHeroMarginTop } from 'modules/update_hero_container_margin_top'

// import { initOffcanvasPaddingTop } from 'modules/update_offcanvas_padding_top'
// import { initOffcanvasBodyHeight } from 'modules/update_offcanvas_body_height'

import { initOffcanvasScrollState } from 'modules/change_offcanvas_scroll_state'
import { initMenuButtonState } from 'modules/change_menu_button_state'

import { initFeedbackFormMask } from 'modules/inputmask_feedback_form'
import { initCookieConsentBanner } from 'modules/cookies_consent_banner_manager'
import { initSubmitButtonBlock } from 'modules/block_submit_button_after_form_data_is_successfully_submitted'
// import { initHeroParallax } from 'modules/hero_image_parallax'

// import { init3dBallsRotation } from 'modules/init_3d_balls_rotation'

import { initVanillaTilt } from 'modules/init__vanilla_tilt'

// * --- MAIN | START AFTER CONTENT LOADED
// * -------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем расчет марджина для героя
    // initHeroMarginTop()

    // initOffcanvasPaddingTop()
    // initOffcanvasBodyHeight()

    initOffcanvasScrollState()
    initMenuButtonState()

    initFeedbackFormMask()
    initSubmitButtonBlock()

    // initHeroParallax()
    initVanillaTilt()

    // ! если юзер отключил анимации -> отключить авто вращение 3D моделей
    // todo: можно сделать через listener, а не как init-вариант
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
        document.querySelectorAll('model-viewer').forEach((mv) => {
            mv.removeAttribute('auto-rotate')
            mv.setAttribute('interaction-prompt', 'none')
        })
    }

    // ! вызываем последним !!!
    initCookieConsentBanner()
})

// window.addEventListener('load', () => {
//     init3dBallsRotation()
// })
