// * --- VENDORS SCRIPTS
// * -------------------
import 'bootstrap'

// * --- MY SCRIPTS
// * --------------
import { init3DBalls } from 'modules/ball-viewer'
import { initVanillaTilt } from 'modules/postload/init__vanilla_tilt'

import { initCookieConsentBannerManager } from 'modules/postload/manager__cookies_consent_banner'

import { initMenuButtonStateManager } from 'modules/postload/manager__menu_button_state'
import { initOffcanvasScrollStateManager } from 'modules/postload/manager__offcanvas_scroll_state'
import { initHeroBackgroundImageParallaxManager } from 'modules/postload/manager__hero__background_image_parallax'
import { initFooterPositionStateManager } from 'modules/postload/manager__footer_position_state'

import { initFeedbackFormInputMask } from 'modules/postload/init__feedback_form__inputmask'

// * --- MAIN | START AFTER CONTENT LOADED
// * -------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // ! --- вызываются первыми !!!
    // ! --------------------------
    initCookieConsentBannerManager()
    initHeroBackgroundImageParallaxManager()
    // ! --------------------------

    initMenuButtonStateManager()
    initOffcanvasScrollStateManager()
    initFeedbackFormInputMask()
    initFooterPositionStateManager()

    // ! --- вызываются последними | сначала обсчитываем более важные скрипты страницы !!!
    // ! ---------------------------------------------------------------------------------
    initVanillaTilt()
    init3DBalls()
    // ! --------------------------
})
