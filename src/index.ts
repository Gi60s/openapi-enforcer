import { generateComponents, normalizeOptions, ComponentOptions, v2 as Iv2, v3 as Iv3 } from './components'

export function OpenAPIEnforcer (options?: ComponentOptions): { v2: Iv2, v3: Iv3 } {
  const opts = normalizeOptions(options)
  return {
    v2: generateComponents(2, opts) as Iv2,
    v3: generateComponents(3, opts) as Iv3
  }
}
