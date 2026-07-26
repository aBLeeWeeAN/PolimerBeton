/* eslint-disable curly */
/* eslint-disable no-console */

import fs from 'node:fs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

yargs(hideBin(process.argv))
    .parserConfiguration({ 'camel-case-expansion': true })
    .wrap(Math.min(100, yargs(hideBin(process.argv)).terminalWidth()))
    .version('version', 'Show version', '1.0.0')
    .alias('version', 'v')
    .help('help', 'Show help')
    .alias('help', 'h')
    .option('verbose', {
        alias: 'V',
        type: 'boolean',
        default: false,
        description: 'Enable verbose logging',
    })

    .command(
        'encode [files...]',
        'Convert inline `--my-kebab` to <code>--my-kebab</code> and replace internal hyphens with &#8209;',
        (y) =>
            y.positional('files', {
                describe: '.md files',
                type: 'string',
                array: true,
            }),
        (argv) => {
            const files = argv.files ?? []
            processFiles(files, 'encode', argv.verbose)
        },
    )

    .command(
        'decode [files...]',
        'Revert <code>--my-kebab</code> to `--my-kebab` and restore standard hyphens inside',
        (y) =>
            y.positional('files', {
                describe: '.md files',
                type: 'string',
                array: true,
            }),
        (argv) => {
            const files = argv.files ?? []
            processFiles(files, 'decode', argv.verbose)
        },
    )

    .demandCommand(1, 'Please specify a command: encode or decode')
    .strict()
    .parse()

// --- Handler ---
function processFiles(files: string[], command: 'encode' | 'decode', verbose: boolean): void {
    if (files.length === 0) {
        console.error('Please specify at least one .md file')
        process.exit(1)
    }

    for (const file of files) {
        if (!file.endsWith('.md')) {
            if (verbose) console.warn(`Skipped non-.md file: ${file}`)
            continue
        }

        if (!fs.existsSync(file)) {
            console.error(`Error: File not found: ${file}`)
            continue
        }

        let content = fs.readFileSync(file, 'utf-8')

        if (command === 'encode') {
            // 1. Изолируем многострочные блоки кода (```...```)
            const codeBlocks: string[] = []
            content = content.replace(/(```[\s\S]*?```)/g, (match) => {
                codeBlocks.push(match)
                return `__CODE_BLOCK_PLACEHOLDER_${codeBlocks.length - 1}__`
            })

            // 2. Безопасно обрабатываем инлайновые бэктики (учитывая экранирование внутри)
            content = content.replace(/(?<!`)(`[^`\r\n\\]*(?:\\.[^`\r\n\\]*)*`)(?!`)/g, (_, p1) => {
                const inner = p1
                    .slice(1, -1)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/-/g, '&#8209;')

                // Добавляем маркер encoded-by-transform-md, чтобы decode не зацепил чужие теги <code>
                return `<code encoded-by-transform-md="true">${inner}</code>`
            })

            // 3. Возвращаем многострочные блоки кода обратно
            content = content.replace(/__CODE_BLOCK_PLACEHOLDER_(\d+)__/g, (_, index) => {
                return codeBlocks[Number(index)]
            })
        } else {
            // Безопасный декод: обрабатываем ТОЛЬКО теги с нашим маркером
            content = content.replace(
                /<code\s+encoded-by-transform-md="true">([\s\S]*?)<\/code>/g,
                (_, inner) => {
                    const decodedInner = inner
                        .replace(/&#8209;/g, '-')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&')
                    return `\`${decodedInner}\``
                },
            )
        }

        fs.writeFileSync(file, content, 'utf-8')
        console.log(`${command === 'encode' ? 'Encoded' : 'Decoded'}: ${file}`)
    }
}
