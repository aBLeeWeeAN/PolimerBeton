const cookie_box = document.getElementById('Cookies-Consent-Banner');
const buttons = document.querySelectorAll(".cookie-button");

const execute_codes = () => {
    if (document.cookie.includes("codingLab")) return;
    cookie_box.classList.add('show');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            cookie_box.classList.remove('show');

            if (button.id === 'cookie-accept-btn') {
                // document.cookie = "cookies_accepted=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/";
                document.cookie = "cookieBy= codingLab; max-age=" + 60 * 60 * 24 * 30;
            }
        });
    });
};

// execute_codes function will be called on page load
window.addEventListener('load', execute_codes, false);
