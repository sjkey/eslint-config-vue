import { pluginPrettier } from '../plugins'
import type { FlatConfigItem } from '../types'

export const prettier = async (): Promise<FlatConfigItem[]> => [
  {
    name: 'antfu:prettier',
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 90,
          tabWidth: 2,
          semi: false,
          singleQuote: true,
          bracketSpacing: true,
          arrowParens: 'always',
          trailingComma: 'all',
          plugins: ['prettier-plugin-tailwindcss'],
        },
      ],
    },
  },
]
