import fs from 'node:fs'
import process from 'node:process'
import {
  comments,
  ignores,
  imports,
  javascript,
  jsonc,
  node,
  prettier,
  sortPackageJson,
  sortTsconfig,
  test,
  typescript,
  unicorn,
  vue,
  yaml,
  stylistic,
} from './configs'
import type { Awaitable, FlatConfigItem, OptionsConfig, UserConfigItem } from './types'
import { combine, interopDefault } from './utils'

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>

export const resolveSubOptions = <K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> =>
  typeof options[key] === 'boolean' ? ({} as any) : options[key] || {}

export const getOverrides = <K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
) => {
  const sub = resolveSubOptions(options, key)
  return {
    ...(options.overrides as any)?.[key],
    ...('overrides' in sub ? sub.overrides : {}),
  }
}

const flatConfigProps: Array<keyof FlatConfigItem> = [
  'name',
  'files',
  'ignores',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
]

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & FlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<UserConfigItem | UserConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<UserConfigItem[]>}
 *  The merged ESLint configurations.
 */
export const sjkeyConfig = async (
  options: OptionsConfig & FlatConfigItem = {},
  ...userConfigs: Array<Awaitable<UserConfigItem | UserConfigItem[]>>
): Promise<UserConfigItem[]> => {
  const {
    gitignore: enableGitignore = true,
    isInEditor = !!(
      (process.env.VSCODE_PID ||
        process.env.VSCODE_CWD ||
        process.env.JETBRAINS_IDE ||
        process.env.VIM) &&
      !process.env.CI
    ),
  } = options

  const configs: Array<Awaitable<FlatConfigItem[]>> = []

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(
        interopDefault(import('eslint-config-flat-gitignore')).then((r) => [
          r(enableGitignore),
        ]),
      )
    } else {
      if (fs.existsSync('.gitignore'))
        configs.push(
          interopDefault(import('eslint-config-flat-gitignore')).then((r) => [r()]),
        )
    }
  }

  // Base configs
  configs.push(
    ignores(),
    javascript({
      isInEditor,
      overrides: getOverrides(options, 'javascript'),
    }),
    prettier(),
    comments(),
    node(),
    stylistic(),
    imports(),
    unicorn(),
    vue({
      ...resolveSubOptions(options, 'vue'),
      overrides: getOverrides(options, 'vue'),
    }),
    typescript({
      ...resolveSubOptions(options, 'typescript'),
      overrides: getOverrides(options, 'typescript'),
    }),
  )

  if (options.test ?? true) {
    configs.push(
      test({
        isInEditor,
        overrides: getOverrides(options, 'test'),
      }),
    )
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, 'jsonc'),
      }),
      sortPackageJson(),
      sortTsconfig(),
    )
  }

  if (options.yaml ?? true) {
    configs.push(
      yaml({
        overrides: getOverrides(options, 'yaml'),
      }),
    )
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) acc[key] = options[key] as any
    return acc
  }, {} as FlatConfigItem)
  if (Object.keys(fusedConfig).length) configs.push([fusedConfig])

  const merged = combine(...configs, ...userConfigs)

  return merged
}
