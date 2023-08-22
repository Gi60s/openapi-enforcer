
const configuration: Required<IConfiguration> = {
  'components.paths.findPathMatches.trimTrailingSlashes': true,
  'components.paths.findPathMatches.useCaseSensitivePaths': true,
  'i18n.language': 'en'
}

export interface IConfiguration {
  'components.paths.findPathMatches.trimTrailingSlashes'?: boolean
  'components.paths.findPathMatches.useCaseSensitivePaths'?: boolean
  'i18n.language'?: string
}

export function find<T> (key: string): T {
  const k = key + '.'
  const result: Record<string, any> = {}
  Object.keys(configuration).forEach(option => {
    if (option.startsWith(k)) {
      // @ts-expect-error
      result[option.substring(k.length)] = configuration[option]
    }
  })
  return result as unknown as T
}

export function normalize<T> (key: string, options?: Record<string, any>): T {
  return Object.assign({}, find(key), options) as unknown as T
}

export function set (options: IConfiguration): void {
  const keys = Object.keys(options) as Array<keyof IConfiguration>
  keys.forEach((key: keyof IConfiguration) => {
    if (options[key] !== undefined) {
      // @ts-expect-error
      configuration[key] = options[key]
    }
  })
}
