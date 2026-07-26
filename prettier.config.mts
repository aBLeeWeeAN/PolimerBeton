import { type Config } from 'prettier'

// TODO: забблочить переносы > [!NOTE] > в Markdown
const config: Config = {
    plugins: ['prettier-plugin-jinja-template', '@prettier/plugin-xml', 'prettier-plugin-sh'],

    // * --- default `prettier` options
    // * ------------------------------
    semi: false,
    tabWidth: 4,
    useTabs: false,
    printWidth: 100,
    singleQuote: true,
    jsxSingleQuote: true,
    bracketSpacing: true,
    objectWrap: 'preserve',
    bracketSameLine: true,
    arrowParens: 'always',
    insertPragma: false,
    requirePragma: false,
    checkIgnorePragma: true,
    quoteProps: 'consistent',
    singleAttributePerLine: false,
    htmlWhitespaceSensitivity: 'ignore',
    embeddedLanguageFormatting: 'auto',
    trailingComma: 'all',
    proseWrap: 'never',
    endOfLine: 'lf',

    // * --- `prettier-plugin-sh` options
    // * --------------------------------
    keepComments: true,
    binaryNextLine: true,
    switchCaseIndent: true,
    spaceRedirects: true,
    functionNextLine: false,

    overrides: [
        { files: ['*.json', '*.webmanifest'], options: { tabWidth: 4 } },
        {
            files: ['*.md'], // Переопределяем только для Markdown
            options: {
                tabWidth: 2,
                parser: 'markdown',
                proseWrap: 'preserve',
            },
        },
        {
            files: ['*.svg', '*.xml'], // Переопределяем только для XML
            options: {
                parser: 'xml',
                tabWidth: 2,
                xmlSortAttributesByKey: true,
                xmlWhitespaceSensitivity: 'ignore',
            },
        },
        {
            files: ['*.html', '*.nj', '*.njk', '*.nunjucks'],
            options: {
                printWidth: 140,
                parser: 'jinja-template',
                // embeddedLanguageFormatting: 'off', //! <-- problem was with this option !!! | resolved in prettier-plugin-jinja-template v2.2.0
            },
        },
    ],
}

export default config
