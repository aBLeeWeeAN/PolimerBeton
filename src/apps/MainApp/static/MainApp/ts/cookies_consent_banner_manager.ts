const cookieBox = document.getElementById("Cookies-Consent-Banner");
const buttons = document.querySelectorAll<HTMLButtonElement>(".cookie-button");
const analyticsContainer = document.getElementById("Third-Party-Cookies-Container");

if (!cookieBox) {
    throw new Error("Error --- cookies_consent_banner_manager.ts --- Cookie box not found!");
}

if (!buttons) {
    throw new Error("Error --- cookies_consent_banner_manager.ts --- Buttons not found!");
}

if (!analyticsContainer) {
    throw new Error("Error --- cookies_consent_banner_manager.ts --- Analytics container not found!");
}

// Изначально отключаем анимацию
cookieBox?.classList.add("no-transition");

/**========================================================================
 **                            THIRD PARTY COOKIES SCRIPTS
 *========================================================================**/

// Яндекс.Метрика в виде строки
const yandexMetrikaScript = `
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(98233807, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
    });
`;

const yandexMetrikaNoscript = `
    <div><img src="https://mc.yandex.ru/watch/98233807" style="position:absolute; left:-9999px;" alt="" /></div>
`;

// Google Analytics в виде строки
const googleAnalyticsScript = `
    (function() {
        var script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XSZP3WXDN6';
        script.async = true;
        document.head.appendChild(script);
        
        script.onload = function() {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-XSZP3WXDN6');
        };
    })();
`;

/*============================ END OF THIRD PARTY COOKIES SCRIPTS ============================*/

/**========================================================================
 **                            SERVICE SCRIPTS
 *========================================================================**/

// Функция для динамического добавления скриптов
const injectAnalyticsScripts = (): void => {
    if (!analyticsContainer) return;

    // Добавляем Яндекс.Метрику
    const scriptYandex = document.createElement("script");
    scriptYandex.type = "text/javascript";
    scriptYandex.innerHTML = yandexMetrikaScript;
    scriptYandex.async = true;
    analyticsContainer.appendChild(scriptYandex);

    // Добавляем Google Analytics
    const scriptGoogle = document.createElement("script");
    scriptGoogle.type = "text/javascript";
    scriptGoogle.innerHTML = googleAnalyticsScript;
    analyticsContainer.appendChild(scriptGoogle);

    // Добавляем noscript для Яндекс.Метрики
    const noscript = document.createElement("noscript");
    noscript.innerHTML = yandexMetrikaNoscript;
    analyticsContainer.appendChild(noscript);

    // Скрываем контейнер скриптов
    analyticsContainer.style.display = "none";
};

// Функция для получения значения куки по имени
const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
};

// Функция для удаления куки
const deleteCookie = (name: string): void => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Функция для проверки наличия куков Яндекс.Метрики
const hasYandexCookies = (): boolean => {
    const cookies = document.cookie.split("; ");
    return cookies.some((cookie) => cookie.startsWith("_ym"));
};

// Функция для удаления всех куки Яндекс.Метрики
const deleteYandexCookies = (): void => {
    const cookies = document.cookie.split("; ");
    cookies.forEach((cookie) => {
        const [name] = cookie.split("=");
        if (name.startsWith("_ym")) {
            deleteCookie(name);
        }
    });
};

/*============================ END OF SERVICE SCRIPTS ============================*/

const executeCodes = (): void => {
    const analyticalCookiesValue = getCookie("analytical_cookies_accepted");

    if (analyticalCookiesValue === "true") {
        // Если куки уже установлены, загрузить скрипты
        injectAnalyticsScripts();
        return;
    } else if (analyticalCookiesValue === "false") {
        // Если куки отклонены, не делать ничего
        return;
    } else {
        // если куки истекли, подчистить оставшиеся, если остались
        if (hasYandexCookies()) {
            deleteYandexCookies();
        }

        // Если куки нет, включить transition и показать баннер
        cookieBox?.classList.remove("no-transition");
        cookieBox?.classList.add("show");

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                cookieBox?.classList.remove("show");

                // Ждём завершения анимации и отключаем transition
                setTimeout(() => {
                    cookieBox?.classList.add("no-transition");
                }, 300);

                if (button.id === "cookie-accept-btn") {
                    document.cookie = "analytical_cookies_accepted=true; max-age=" + 60 * 60 * 24 * 30 + "; path=/";
                    injectAnalyticsScripts(); // Включаем аналитику
                    return;
                }

                // decline button pressed
                document.cookie = "analytical_cookies_accepted=false; max-age=" + 60 * 60 * 24 * 30 + "; path=/";
            });
        });
    }
};

// executeCodes function will be called on page load
window.addEventListener("load", executeCodes, false);

export {};
