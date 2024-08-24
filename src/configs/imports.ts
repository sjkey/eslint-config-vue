import { pluginAntfu, pluginImport } from '../plugins'
import type { FlatConfigItem } from '../types'

export const imports = async (): Promise<FlatConfigItem[]> => [
  {
    name: 'antfu:imports',
    plugins: {
      antfu: pluginAntfu,
      import: pluginImport,
    },
    rules: {
      'antfu/import-dedupe': 'error',
      'antfu/no-import-dist': 'error',
      'antfu/no-import-node-modules-by-path': 'error',

      'import/export': 'error',
      'import/first': 'error',
      'import/no-cycle': 'error',
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      'import/no-empty-named-blocks': 'error',
      'import/no-named-default': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/order': [
        'error',
        {
          alphabetize: {
            caseInsensitive: true,
            order: 'asc',
          },
          groups: ['external', 'builtin', 'internal', 'sibling', 'parent', 'index'],
        },
      ],
    },
  },
]
