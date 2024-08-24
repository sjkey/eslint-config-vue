import process from 'node:process'
import { GLOB_SRC, GLOB_TS } from '../globs'
import { pluginAntfu, pluginStylistic, pluginStylisticTs } from '../plugins'
import type {
  FlatConfigItem,
  OptionsComponentExts,
  OptionsFiles,
  OptionsOverrides,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
} from '../types'
import { interopDefault, renameRules, toArray } from '../utils'

export const typescript = async (
  options: OptionsFiles &
    OptionsComponentExts &
    OptionsOverrides &
    OptionsTypeScriptWithTypes &
    OptionsTypeScriptParserOptions = {},
): Promise<FlatConfigItem[]> => {
  const { componentExts = [], overrides = {}, parserOptions = {} } = options

  const files = options.files ?? [GLOB_SRC, ...componentExts.map((ext) => `**/*.${ext}`)]

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS]
  const tsconfigPath = options?.tsconfigPath ? toArray(options.tsconfigPath) : undefined
  const isTypeAware = !!tsconfigPath

  const typeAwareRules: FlatConfigItem['rules'] = {
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'no-throw-literal': 'off',
    'ts/await-thenable': 'error',
    'ts/dot-notation': ['error', { allowKeywords: true }],
    'ts/no-floating-promises': 'error',
    'ts/no-for-in-array': 'error',
    'ts/no-implied-eval': 'error',
    'ts/no-misused-promises': 'error',
    'ts/no-throw-literal': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/no-unsafe-argument': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/restrict-plus-operands': 'error',
    'ts/restrict-template-expressions': 'error',
    'ts/unbound-method': 'error',
  }

  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('@typescript-eslint/parser')),
  ] as const)

  const makeParser = (
    typeAware: boolean,
    files: string[],
    ignores?: string[],
  ): FlatConfigItem => ({
    files,
    ...(ignores ? { ignores } : {}),
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        extraFileExtensions: componentExts.map((ext) => `.${ext}`),
        sourceType: 'module',
        ...(typeAware
          ? {
              project: tsconfigPath,
              tsconfigRootDir: process.cwd(),
            }
          : {}),
        ...(parserOptions as any),
      },
    },
    name: `antfu:typescript:${typeAware ? 'type-aware-parser' : 'parser'}`,
  })

  return [
    {
      // Install the plugins without globs, so they can be configured separately.
      name: 'antfu:typescript:setup',
      plugins: {
        antfu: pluginAntfu,
        ts: pluginTs as any,
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
    // assign type-aware parser for type-aware files and type-unaware parser for the rest
    ...(isTypeAware
      ? [makeParser(true, filesTypeAware), makeParser(false, files, filesTypeAware)]
      : [makeParser(false, files)]),
    {
      files,
      name: 'antfu:typescript:rules',
      rules: {
        ...renameRules(
          pluginTs.configs['eslint-recommended'].overrides![0].rules!,
          '@typescript-eslint/',
          'ts/',
        ),
        ...renameRules(pluginTs.configs.strict.rules!, '@typescript-eslint/', 'ts/'),
        'no-dupe-class-members': 'off',
        'no-loss-of-precision': 'off',
        'no-redeclare': 'off',
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        'ts/array-type': [
          'error',
          {
            default: 'array-simple',
            readonly: 'array-simple',
          },
        ],
        'ts/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
        'ts/consistent-type-definitions': ['error', 'type'],
        'ts/consistent-type-imports': [
          'error',
          { disallowTypeAnnotations: false, prefer: 'type-imports' },
        ],
        'ts/member-ordering': [
          'error',
          {
            default: {
              optionalityOrder: 'required-first',
            },
          },
        ],
        'ts/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        'ts/no-dupe-class-members': 'error',
        'ts/no-dynamic-delete': 'off',
        'ts/no-explicit-any': 'off',
        'ts/no-extraneous-class': 'off',
        'ts/no-import-type-side-effects': 'error',
        'ts/no-invalid-void-type': 'off',
        'ts/no-loss-of-precision': 'error',
        'ts/no-non-null-assertion': 'off',
        'ts/no-redeclare': 'error',
        'ts/no-require-imports': 'error',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': [
          'error',
          { classes: false, functions: false, variables: true },
        ],
        'ts/no-useless-constructor': 'off',
        'ts/prefer-ts-expect-error': 'error',
        'ts/triple-slash-reference': 'off',
        'ts/unified-signatures': 'off',
        ...overrides,
      },
    },
    {
      files: filesTypeAware,
      name: 'antfu:typescript:rules-type-aware',
      rules: {
        ...(tsconfigPath ? typeAwareRules : {}),
        ...overrides,
      },
    },
    {
      files: ['**/*.d.ts'],
      name: 'antfu:typescript:dts-overrides',
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.{test,spec}.ts?(x)'],
      name: 'antfu:typescript:tests-overrides',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'antfu:typescript:javascript-overrides',
      rules: {
        'ts/no-require-imports': 'off',
        'ts/no-var-requires': 'off',
      },
    },
  ]
}
