// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE: ASSISTED BY DEEPSEEK & GOOGLE AI
// ! Logic verified by output results. Maintained by aLeeTheY.
// ! ------------------------------------------------------------

/**
 * Заменяет помеченные блоки в HTML на инлайн-ресурсы, если включены флаги.
 * @param {string} html - исходный HTML из Nunjucks
 * @param {object} options
 * @param {boolean} options.inlineCss - вставить CSS инлайн
 * @param {string} options.cssContent - содержимое CSS
 * @param {boolean} options.inlineJs - вставить JS инлайн
 * @param {string} options.jsContent - содержимое JS
 * @param {boolean} options.inlineSprite - вставить SVG-спрайт
 * @param {string} options.spriteContent - содержимое спрайта
 * @returns {string} обработанный HTML
 */
export function inlineAssetsInHtml(html, options = {}) {
    const {
        inlineCss = false,
        cssContent = '',
        inlineJs = false,
        jsContent = '',
        inlineSprite = false,
        spriteContent = '',
    } = options

    // --- CSS блок ---
    if (inlineCss && cssContent) {
        const cssRegex =
            /<!-- ! DO NOT REMOVE THIS COMMENT !!! \| INLINE CSS START \| DISABLED BY DEFAULT --->[\s\S]*?<!-- ! DO NOT REMOVE THIS COMMENT !!! \| INLINE CSS END --->/g
        html = html.replace(
            cssRegex,
            `<style type="text/css" id="inline-css">${cssContent}</style>`,
        )
    }

    // --- JS блок ---
    if (inlineJs && jsContent) {
        const jsRegex =
            /<!-- ! DO NOT REMOVE THIS COMMENT !!! \| INLINE JS START \| DISABLED BY DEFAULT --->[\s\S]*?<!-- ! DO NOT REMOVE THIS COMMENT !!! \| INLINE JS END --->/g
        html = html.replace(
            jsRegex,
            `<script type="text/javascript" id="inline-js">${jsContent}</script>`,
        )
    }

    // --- SVG спрайт перед </body> ---
    if (inlineSprite && spriteContent) {
        html = html.replace('</body>', `<div style="display:none;">${spriteContent}</div>\n</body>`)
    }

    return html
}
