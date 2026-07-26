import type { Config } from 'stylelint'

export default {
    extends: ['stylelint-config-standard-scss'],
    plugins: ['stylelint-no-unsupported-browser-features'],
    rules: {
        // 'plugin/selector-bem-pattern': {
        //     componentName: '[a-z0-9]+(?:-[a-z0-9]+)*',
        //     componentSelectors: { initial: '^\\.{componentName}(?:__[a-z0-9]+)?(?:--[a-z0-9]+)?$' },
        //     utilitySelectors: '^\\.util-[a-z]+$',
        // },
        'plugin/no-unsupported-browser-features': [
            true,
            {
                // * plugin reads 'production' section by default from .browserslistrc
                // browsers: ['last 4 versions', '> 0.2%', 'not dead'],
                ignore: ['css-nesting', 'multicolumn'],
                severity: 'warning',
                // * disabled by default
                // ignorePartialSupport: true,
            },
        ],

        'scss/double-slash-comment-empty-line-before': null,
        'scss/dollar-variable-empty-line-before': null,
        'media-feature-range-notation': 'prefix',
        'declaration-empty-line-before': null,
        'at-rule-empty-line-before': null,
        'selector-class-pattern': null,
        'custom-property-pattern': null,
        // 'length-zero-no-unit': null,
        'number-max-precision': 5,
        'font-family-name-quotes': 'always-unless-keyword',
        // 'scss/double-slash-comment-whitespace-inside': '^\\/\\/[!*?todo] ([a-z0-9])*$',
        'scss/at-mixin-pattern': '^([a-z0-9]+(-[a-z0-9]+)*)(--[a-z0-9]+)?$',
    },
} satisfies Config
