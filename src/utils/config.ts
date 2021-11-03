import { Version } from '../components'
import { Level } from '../DefinitionException/types'

export type CodeLevels = Record<string, Level>

export interface Configuration {
  exceptions?: ExceptionConfiguration
  version?: Version
}

export interface ExceptionConfiguration {
  // none - show only message
  // code - ex: Field is required. [codeX]
  // id - ex: Field is required. [FIELD_REQUIRED]
  // footnote - ex: Field is required [2]
  // locations - ex: Field is required \n my-file.js:20:7 (locations on following lines)
  // detailed - shows code, id, locations, breadcrumbs
  details: 'none' | 'all' | 'breadcrumbs' | 'code' | 'footnote' | 'id' | 'locations'
  levels?: CodeLevels
  message: 'text' | 'data' | 'json' // if "json" then details and locations settings are ignored
}

export interface FullConfiguration {
  exceptions: Required<ExceptionConfiguration>
  version: Version
}

let current: FullConfiguration = {
  exceptions: {
    details: 'code',
    levels: {},
    message: 'text'
  },
  version: '3.0.0'
}

const schema = {
  type: 'object',
  properties: {
    exceptions: {
      type: 'object',
      properties: {
        details: {
          type: 'string',
          enum: ['none', 'all', 'breadcrumbs', 'code', 'footnote', 'id', 'locations']
        },
        levels: {
          type: 'object',
          additionalProperties: {
            type: 'string',
            enum: ['ignore', 'opinion', 'warn', 'error']
          }
        }
      }
    },
    production: {
      type: 'boolean'
    }
  }
}

export function set (configuration: Configuration): void {
  current = update(schema, configuration, current, '')
}

export function get (): FullConfiguration {
  return current
}

function update (schema: any, source: any, original: any, path: string): any {
  const { type } = schema
  const sType = typeof source

  if (type === 'array') {
    if (!Array.isArray(source)) throw Error('Invalid type at ' + path + '. Expected an array.')
    return source.map((s, i) => update(schema.items, s, original[i], path + ' > ' + String(i)))
  } else if (type === 'boolean') {
    if (sType !== 'boolean') throw Error('Invalid type at ' + path + '. Expected a boolean.')
    return source
  } else if (type === 'string') {
    if (sType !== 'string') throw Error('Invalid type at ' + path + '. Expected a string.')
    if ('enum' in schema && schema.enum.includes(source) === false) throw Error('Invalid value at ' + path + '. Expected on of: ' + (schema.enum.join(', ') as string))
    return source
  } else if (type === 'object') {
    if (source === null || sType !== 'object') throw Error('Invalid type at ' + path + '. Expected a non-null object.')

    const result: any = Object.assign({}, original)
    if ('properties' in schema) {
      Object.keys(schema.properties).forEach(propName => {
        if (propName in source) {
          const subSchema = schema.properties[propName]
          result[propName] = update(subSchema, source[propName], original[propName], path + ' > ' + propName)
        }
      })
    }
    return result
  }
}
