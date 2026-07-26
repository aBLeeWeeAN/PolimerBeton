const isDev = process.env.NODE_ENV === 'development'

export default {
    multipass: true,
    eol: 'lf',
    js2svg: {
        ...(isDev && {
            indent: 4,
            pretty: true,
            finalNewline: true,
        }),
        // precision: 3,
    },
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    // * u can disable any plugin from 'preset-default' here
                    // removeViewBox: false,
                    // cleanupIds: false,
                    // inlineStyles: {
                    //     onlyMatchedOnce: false,
                    // },
                },
            },
        },
    ],
}
