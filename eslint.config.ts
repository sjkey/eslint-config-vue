import stylistic from '@stylistic/eslint-plugin'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import unusedImports from 'eslint-plugin-unused-imports'
import { sjkeyConfig } from './src'

export default sjkeyConfig(
  {},
  {
    plugins: {
      '@stylistic': stylistic,
      '@stylistic/ts': stylisticTs,
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',

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
)
