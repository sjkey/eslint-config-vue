import { GLOB_EXCLUDE } from '../globs'
import type { FlatConfigItem } from '../types'

export const ignores = async (): Promise<FlatConfigItem[]> => [
  {
    ignores: GLOB_EXCLUDE,
  },
]
