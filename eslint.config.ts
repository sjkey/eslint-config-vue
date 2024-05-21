import { FlatCompat } from '@eslint/eslintrc'
import sjkeyConfig from './src'

const compat = new FlatCompat()

export default sjkeyConfig(
  {},
  ...compat.config({
    plugins: ['unused-imports', 'prefer-arrow-functions'],
    rules: {
      'unused-imports/no-unused-imports': 'error',

      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          allowNamedFunctions: false,
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false,
        },
      ],
    },
  }),
)
