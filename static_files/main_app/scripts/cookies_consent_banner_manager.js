const cookie_box = document.getElementById('Cookies-Consent-Banner');
const buttons = document.querySelectorAll(".cookie-button");
const analytics_container = document.getElementById('Third-Party-Cookies-Container');

// Изначально отключаем анимацию
cookie_box.classList.add('no-transition');



/**========================================================================
 **                            THIRD PARTY COOKIES SCRIPTS
 *========================================================================**/

// Яндекс.Метрика в виде строки
const yandex_metrika_script = `
    (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
        m[i].l = 1 * new Date();
        for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
        k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(97288202, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true
    });
`;

const yandex_metrika_noscript = `
    <div><img src="https://mc.yandex.ru/watch/97288202" style="position:absolute; left:-9999px;" alt="" /></div>
`;

/*============================ END OF THIRD PARTY COOKIES SCRIPTS ============================*/



/**========================================================================
 **                            SERVICE SCRIPTS 
 *========================================================================**/

// Функция для динамического добавления скриптов
const inject_analytics_scripts = () => {
    const script = document.createElement('script');
    
    script.type = 'text/javascript';
    script.innerHTML = yandex_metrika_script;
    script.async = true;

    document.getElementById('Third-Party-Cookies-Container').appendChild(script);

    // Также можно добавить noscript тег, если нужно:
    const noscript = document.createElement('noscript');
    noscript.innerHTML = yandex_metrika_noscript;

    document.getElementById('Third-Party-Cookies-Container').appendChild(noscript);

    // d-none for this scripts container
    analytics_container.style.display = 'none';
};

// Функция для получения значения куки по имени
const get_cookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

// Функция для удаления куки
const delete_cookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Функция для проверки наличия куков Яндекс.Метрики
const has_yandex_cookies = () => {
    const cookies = document.cookie.split('; ');
    return cookies.some(cookie => cookie.startsWith('_ym'));
};

// Функция для удаления всех куки Яндекс.Метрики
const delete_yandex_cookies = () => {
    const cookies = document.cookie.split('; ');
    cookies.forEach(cookie => {
        const [name] = cookie.split('=');
        if (name.startsWith('_ym')) {
            delete_cookie(name);
        }
    });
};

/*============================ END OF SERVICE SCRIPTS ============================*/



const execute_codes = () => {
    const analytical_cookies_value = get_cookie("analytical_cookies_accepted");

    if (analytical_cookies_value === 'true') {
        // Если куки уже установлены, загрузить скрипты
        inject_analytics_scripts();
        return;
    } else if (analytical_cookies_value === 'false') {
        // Если куки отклонены, не делать ничего
        return;
    } else {
        // если куки истекли, подчистить оставшиеся, если остались
        if (has_yandex_cookies()) {
            delete_yandex_cookies();
        }

        // Если куки нет, включить transition и показать баннер
        cookie_box.classList.remove('no-transition');
        cookie_box.classList.add('show');

        buttons.forEach(button => {
            button.addEventListener('click', function() {
                cookie_box.classList.remove('show');

                // Ждём завершения анимации и отключаем transition, наверно это даже кастыль :/ ... Но мне надоело
                setTimeout(() => {
                    cookie_box.classList.add('no-transition');
                }, 300); // 300 миллисекунд, что соответствует 0.3 секунды из transition в css
    
                if (button.id === 'cookie-accept-btn') {
                    document.cookie = "analytical_cookies_accepted=true; max-age=" + 60 * 60 * 24 * 30 + "; path=/";
    
                    inject_analytics_scripts(); // Включаем аналитику
                    return;
                }
    
                // decline button pressed
                document.cookie = "analytical_cookies_accepted=false; max-age=" + 60 * 60 * 24 * 30 + "; path=/";
            });
        });
    }
};

// execute_codes function will be called on page load
window.addEventListener('load', execute_codes, false);
