// * --- VENDORS SCRIPTS
// * -------------------
import 'bootstrap'

// * --- MY SCRIPTS
// * --------------
import { initOffcanvasScrollState } from 'modules/manager__offcanvas_scroll_state'
import { initMenuButtonState } from 'modules/change_menu_button_state'

import { initFeedbackFormMask } from 'modules/inputmask_feedback_form'
import { initCookieConsentBanner } from 'modules/manager__cookies_consent_banner'
import { initSubmitButtonBlock } from 'modules/block_submit_button_after_form_data_is_successfully_submitted'

import { init3DBalls } from 'modules/ball-viewer'
import { initVanillaTilt } from 'modules/init__vanilla_tilt'

// * --- MAIN | START AFTER CONTENT LOADED
// * -------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initOffcanvasScrollState()
    initMenuButtonState()

    initFeedbackFormMask()
    initSubmitButtonBlock()

    // initHeroParallax()
    init3DBalls()
    initVanillaTilt()

    // ! вызываем последним !!!
    initCookieConsentBanner()
})
