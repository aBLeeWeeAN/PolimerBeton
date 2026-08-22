import postHTMLNoRef from 'posthtml-link-noreferrer'
import postHTMLAltAlways from 'posthtml-alt-always'

// ! функционал плагина уже реализован в gulp/helpers/html-img2picture-transformer.js
// import postHTMLImgAutoSize from 'posthtml-img-autosize'

export default {
    plugins: [
        postHTMLNoRef({
            attr: ['noopener', 'noreferrer'],
        }),
        postHTMLAltAlways(),
    ],
}
