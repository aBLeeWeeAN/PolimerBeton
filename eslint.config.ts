import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// import { includeIgnoreFile } from '@eslint/compat'
// import { fileURLToPath } from 'node:url'

import stylistic from '@stylistic/eslint-plugin'

// import prettierPlugin from 'eslint-plugin-prettier'
// import prettierConfig from 'eslint-config-prettier'
import prettierRecomended from 'eslint-plugin-prettier/recommended'

// const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig([
    // includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
    globalIgnores([
        '**/public**',
        '**/build/',
        '**/dist/',
        '**/out/',
        '**/old/',
        '**/original/',
        '**/node_modules/',
    ]),
    js.configs.recommended,
    tseslint.configs.recommended,
    prettierRecomended,
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: {
            // js,
            '@stylistic': stylistic,
            // 'prettier': prettierPlugin
        },
        // extends: ['js/recommended', prettierConfig],
        rules: {
            // eslint stylistic rules
            '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],

            // prettier rules
            // ...prettierRecomended.rules,

            // other eslint rules
            'no-console': 'warn',
            'eqeqeq': 'warn',
            'curly': 'warn',
            'no-else-return': 'warn',

            // my additions
            'no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
])
