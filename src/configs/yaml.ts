import { GLOB_YAML } from '../globs'
import type { FlatConfigItem, OptionsFiles, OptionsOverrides } from '../types'
import { interopDefault } from '../utils'

export const yaml = async (
  options: OptionsOverrides & OptionsFiles = {},
): Promise<FlatConfigItem[]> => {
  const { files = [GLOB_YAML], overrides = {} } = options

  const [pluginYaml, parserYaml] = await Promise.all([
    interopDefault(import('eslint-plugin-yml')),
    interopDefault(import('yaml-eslint-parser')),
  ] as const)

  return [
    {
      name: 'antfu:yaml:setup',
      plugins: {
        yaml: pluginYaml,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserYaml,
      },
      name: 'antfu:yaml:rules',
      rules: {
        'style/spaced-comment': 'off',

        'yaml/block-mapping': 'error',
        'yaml/block-mapping-question-indicator-newline': 'error',
        'yaml/block-sequence': 'error',
        'yaml/block-sequence-hyphen-indicator-newline': 'error',
        'yaml/flow-mapping-curly-newline': 'error',
        'yaml/flow-mapping-curly-spacing': 'error',

        'yaml/flow-sequence-bracket-newline': 'error',
        'yaml/flow-sequence-bracket-spacing': 'error',
        'yaml/indent': ['error', 2],
        'yaml/key-spacing': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',
        'yaml/no-tab-indent': 'error',
        'yaml/plain-scalar': 'error',
        'yaml/quotes': ['error', { avoidEscape: false, prefer: 'single' }],
        'yaml/spaced-comment': 'error',
        'yaml/vue-custom-block/no-parsing-error': 'error',

        ...overrides,
      },
    },
  ]
}
