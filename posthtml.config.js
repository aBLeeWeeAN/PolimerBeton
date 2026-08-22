import postHTMLNoRef from 'posthtml-link-noreferrer'

export default {
    plugins: [
        postHTMLNoRef({
            attr: ['noopener', 'noreferrer'],
        }),
    ],
}
