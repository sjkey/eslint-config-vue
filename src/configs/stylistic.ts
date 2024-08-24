import { pluginStylistic, pluginStylisticTs } from '../plugins'
import type { FlatConfigItem } from '../types'

export const stylistic = async (): Promise<FlatConfigItem[]> => [
  {
    name: 'sjkey:stylistic',
    plugins: {
      '@stylistic': pluginStylistic,
      '@stylistic/ts': pluginStylisticTs,
    },
    rules: {
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/ts/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none',
            requireLast: false,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],
      '@stylistic/ts/type-annotation-spacing': [
        'error',
        {
          after: true,
        },
      ],
    },
  },
]
