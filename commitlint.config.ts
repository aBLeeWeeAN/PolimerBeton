import type { UserConfig } from '@commitlint/types'
import { RuleConfigSeverity } from '@commitlint/types'

const Configuration: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    parserPreset: 'conventional-changelog-angular',
    formatter: '@commitlint/format',
    rules: {
        'type-enum': [
            RuleConfigSeverity.Error,
            'always',
            [
                'build',
                'chore',
                'ci',
                'docs',
                'feat',
                'fix',
                'perf',
                'refactor',
                'revert',
                'style',
                'test',
                // * --- my additions
                // * ----------------
                'wip', // work in progress
                'deploy',
            ],
        ],
    },
    // ...
}

export default Configuration

// * --- config by default
// export default { extends: ['@commitlint/config-conventional'] }
