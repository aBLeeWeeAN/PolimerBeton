const isProd = process.env.NODE_ENV === 'production'

export default (ctx) => {
    const isMobileFirst = ctx.options?.config?.ctx?.isMobileFirst || false

    return {
        plugins: {
            // * замена px на rem в зависимости от условий
            // ! default config
            // 'postcss-pxtorem': {
            //     rootValue: 16,
            //     unitPrecision: 5,
            //     propList: ['font', 'font-size', 'line-height', 'letter-spacing', 'word-spacing'],
            //     selectorBlackList: [],
            //     replace: true,
            //     mediaQuery: false,
            //     minPixelValue: 0,
            //     exclude: /node_modules/i,
            // },
            // ! temp disable
            // 'postcss-pxtorem': {
            //     rootValue: 16,
            //     unitPrecision: 5,
            //     propList: [
            //         'font',
            //         'font-size',
            //         'line-height',
            //         'letter-spacing',
            //         'word-spacing',
            //         'margin',
            //         'margin-*',
            //         'padding',
            //         'padding-*',
            //     ],
            //     selectorBlackList: ['html'],
            //     replace: true,
            //     mediaQuery: false,
            //     minPixelValue: 3,
            //     exclude: /node_modules/i,
            // },
            // ! pxToRem --- ALL
            'postcss-pxtorem': {
                rootValue: 16,
                unitPrecision: 5,
                propList: ['*'],
                selectorBlackList: ['html'],
                replace: true,
                mediaQuery: false,
                minPixelValue: 2,
                exclude: /node_modules/i,
            },
            // * замена clamp на комбинации min + max (old plugin)
            // 'postcss-clamp': {
            //     precalculate: true,
            // },
            // * округлить пиксельные значения до целых чисел
            // ! отключать для Fluid Design !!!
            // 'postcss-round-subpixels': {},
            // * fallback для font-variant (совместимость)
            'postcss-font-variant': {},
            // * автоматическое добавление font-display: swap для внешних локальных шрифтов (only works in @font-face)
            'postcss-font-display': {
                display: 'swap',
                replace: false,
            },
            // * css-hack для создания fallback для will-change у браузеров, которые не поддерживают will-change
            'postcss-will-change': {},
            // * preset-env + autoprefixer
            'postcss-preset-env': {
                // default value
                stage: 2,

                // more stable for production mode
                // stage: env === "production" ? 4 : 2,

                // disabled
                // autoprefixer: { grid: true },
            },
            ...(isProd && {
                // * rename переменных css (более короткие)
                'postcss-rename/variable': {
                    strategy: 'minimal',
                    by: 'whole',
                    ids: false,
                    except: ['--dont-touch-me'],
                    outputMapCallback: false,
                },
                // ! disabled
                // * rename имён классов css (более короткие)
                // 'postcss-rename': {
                //     strategy: 'minimal',
                //     by: 'whole',
                //     ids: false,
                //     except: ['.dont-touch-me'],
                //     outputMapCallback: false,
                // },
            }),
            // ! функционал уже есть в cssnano (discardDuplicates)
            // * слияние идентичных селекторов (убираем дубликаты)
            // 'postcss-combine-duplicated-selectors': { removeDuplicatedValues: false },
            // * группировка медиазапросов в конец CSS файла
            // ! отключено | иногда ломает специфичность модификаторов !!!
            // 'postcss-sort-media-queries': {
            //     sort: isMobileFirst ? 'mobile-first' : 'desktop-first',
            // },
            // TODO: доделать webp-in-css и протестить
            // 'webp-in-css/plugin': {
            //     webpClass: 'webp',
            //     noWebpClass: 'no-webp',
            // },
            // ! не подходит
            // * обфускация CSS, замена имён классов упрощёными именами (только в staging/prod)
            // ...(isProd && {
            //     'postcss-obfuscator': {
            //         enable: true,
            //         length: 2,
            //         classMethod: 'random',
            //         ids: false,
            //         idMethod: 'random',
            //         jsonsPath: './dist/css/obfuscator',
            //         srcPath: './dist/css',
            //         fresh: false,
            //         multi: false,
            //     },
            // }),
            // * удаление неиспользуемых CSS (только в staging/prod)
            ...(isProd && {
                '@fullhuman/postcss-purgecss': {
                    content: ['src/html/**/*.njk', 'src/html/**/*.html'],

                    // ! Защитит .page--ru, .page--en, .page--fr и т.д.
                    // ! safelist: [/--[a-z]{2}$/],
                    safelist: [/--ru$/, /--en$/],
                },
            }),
            // * сжатие CSS (только в prod и staging modes)
            ...(isProd && {
                cssnano: {
                    // preset: "default",
                    preset: [
                        'advanced',
                        {
                            // * отключаем склейку правил
                            // mergeRules: false,
                            // minifySelectors: false,
                        },
                    ],
                },
            }),
        },
    }
}
