import { mergeProcessors } from 'eslint-merge-processors'
import { GLOB_VUE } from '../globs'
import type { FlatConfigItem, OptionsFiles, OptionsOverrides, OptionsVue } from '../types'
import { interopDefault } from '../utils'

export const vue = async (
  options: OptionsVue & OptionsOverrides & OptionsFiles = {},
): Promise<FlatConfigItem[]> => {
  const { files = [GLOB_VUE], overrides = {} } = options

  const sfcBlocks = options.sfcBlocks === true ? {} : options.sfcBlocks ?? {}

  const [pluginVue, parserVue, processorVueBlocks] = await Promise.all([
    // @ts-expect-error missing types
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    interopDefault(import('eslint-processor-vue-blocks')),
  ] as const)

  return [
    {
      // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
      },
      name: 'antfu:vue:setup',
      plugins: {
        vue: pluginVue,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: (await interopDefault(import('@typescript-eslint/parser'))) as any,
          sourceType: 'module',
        },
      },
      name: 'antfu:vue:rules',
      processor:
        sfcBlocks === false
          ? pluginVue.processors['.vue']
          : mergeProcessors([
              pluginVue.processors['.vue'],
              processorVueBlocks({
                ...sfcBlocks,
                blocks: {
                  styles: true,
                  ...sfcBlocks.blocks,
                },
              }),
            ]),
      rules: {
        ...(pluginVue.configs.base.rules as any),
        ...(pluginVue.configs['vue3-essential'].rules as any),
        ...(pluginVue.configs['vue3-strongly-recommended'].rules as any),
        ...(pluginVue.configs['vue3-recommended'].rules as any),

        'node/prefer-global/process': 'off',
        'vue/array-bracket-spacing': ['error', 'never'],

        'vue/arrow-spacing': ['error', { after: true, before: true }],
        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],
        'vue/block-spacing': ['error', 'always'],
        'vue/block-tag-newline': [
          'error',
          {
            multiline: 'always',
            singleline: 'always',
          },
        ],
        'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/comma-spacing': ['error', { after: true, before: false }],
        'vue/comma-style': ['error', 'last'],
        'vue/component-name-in-template-casing': [
          'error',
          'kebab-case',
          {
            registeredComponentsOnly: false,
          },
        ],
        'vue/component-options-name-casing': ['error', 'kebab-case'],
        'vue/component-tags-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],
        'vue/custom-event-name-casing': ['error', 'kebab-case'],
        'vue/define-macros-order': [
          'error',
          {
            order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
          },
        ],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-comment-content-spacing': [
          'error',
          'always',
          {
            exceptions: ['-'],
          },
        ],
        'vue/html-indent': 'off',
        'vue/html-quotes': ['error', 'double'],
        'vue/html-self-closing': 'off',
        'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'vue/keyword-spacing': ['error', { after: true, before: true }],
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-dupe-keys': 'off',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/object-curly-newline': 'off',
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/object-property-newline': [
          'error',
          { allowMultiplePropertiesPerLine: true },
        ],
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/operator-linebreak': ['error', 'before'],
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/quote-props': ['error', 'consistent-as-needed'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/space-in-parens': ['error', 'never'],
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
        'vue/template-curly-spacing': 'error',
        'vue/v-bind-style': ['error', 'shorthand'],

        ...overrides,
      },
    },
  ]
}
