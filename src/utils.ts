import type { Awaitable, UserConfigItem } from './types'

/**
 * Combine array and non-array configs into a single array.
 */
export const combine = async (
  ...configs: Array<Awaitable<UserConfigItem | UserConfigItem[]>>
): Promise<UserConfigItem[]> => {
  const resolved = await Promise.all(configs)
  return resolved.flat()
}

export const renameRules = (rules: Record<string, any>, from: string, to: string) =>
  Object.fromEntries(
    Object.entries(rules).map(([key, value]) => {
      if (key.startsWith(from)) return [to + key.slice(from.length), value]
      return [key, value]
    }),
  )

export const toArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value]

export const interopDefault = async <T>(
  m: Awaitable<T>,
): Promise<T extends { default: infer U } ? U : T> => {
  const resolved = await m
  return (resolved as any).default || resolved
}
