import { Exception } from 'exception-tree'

export interface Definition<SchemaType> {
  constructors?: Function[]
  deserialize: (data: { error: Exception, schema: SchemaType, value: any, warning: Exception }) => any
  isNumeric?: boolean
  random?: (data: { error: Exception, options: RandomOptions, schema: SchemaType, warning: Exception }) => any
  serialize: (data: { error: Exception, schema: SchemaType, value: any, warning: Exception }) => any
  validate: (data: { error: Exception, schema: SchemaType, value: any, warning: Exception }) => void
}

export interface DefinitionPlus<SchemaType> extends Definition<SchemaType> {
  type: string
  format: string
}

interface DefinitionMap<SchemaType> {
  [type: string]: {
    [format: string]: DefinitionPlus<SchemaType>
  }
}

export interface Controller {
  copy: (fromType: string, fromFormat: string, toType: string, toFormat: string) => Controller
  define: <SchemaType>(type: string, format: string, definition: Definition<SchemaType>) => Controller
  inheritsFrom: (controller: Controller) => Controller
  getDefinition: <SchemaType>(type: string, format?: string) => DefinitionPlus<SchemaType>
  getFormats: (type: string) => string[]
  getTypes: () => string[]
}

export interface RandomOptions {
  additionalPropertiesPossibility?: number
  arrayVariation?: number
  defaultPossibility?: number
  definedPropertyPossibility?: number
  maxDepth?: number
  numberVariation?: number
  uniqueItemRetry?: number
}

export interface ValidateOptions {
  readWriteMode?: 'read' | 'write'
}

export function Factory (): Controller {
  const dataTypeConstructors: Set<Function> = new Set()
  const dataTypeWarnings: { [k: string]: boolean } = {}
  const dataTypes: DefinitionMap<any> = {}
  const extendsList: Controller[] = []

  return {
    copy (fromType: string, fromFormat: string, toType: string, toFormat: string): Controller {
      const definition = this.getDefinition(fromType, fromFormat)
      if (definition !== undefined) {
        this.define(toType, toFormat, definition)
      } else {
        throw Error('Definition to copy from not found: ' + fromType + ' ' + fromFormat)
      }
      return this
    },

    define<SchemaType> (type: string, format: string, definition: Definition<SchemaType>): Controller {
      if (type === '' || typeof type !== 'string') throw Error('Invalid type specified. Must be a non-empty string')
      if (format === '' || typeof format !== 'string') throw Error('Invalid format specified. Must be a non-empty string')

      if (!(type in dataTypes)) dataTypes[type] = {}
      const exists = this.getDefinition(type, format)
      if (exists !== undefined) throw Error('Defined type already exists: ' + type + ' ' + format)

      if (definition !== null) {
        if (typeof definition !== 'object' ||
          typeof definition.deserialize !== 'function' ||
          typeof definition.serialize !== 'function' ||
          typeof definition.validate !== 'function' ||
          ('random' in definition && typeof definition.random !== 'function')) throw Error('Invalid data type definition. Must be an object that defines handlers for "deserialize", "serialize", and "validate" with optional "random" handler.')

        if ('constructors' in definition) {
          if (!Array.isArray(definition.constructors)) {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            throw Error('Invalid data type constructors value. Expected an array of functions. Received: ' + definition.constructors)
          }
          definition.constructors.forEach((fn: Function) => {
            if (typeof fn !== 'function') {
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              throw Error('Invalid constructor specified. Expected a function, received: ' + fn)
            }
            dataTypeConstructors.add(fn)
          })
        } else {
          const key = type + '-' + format
          if (!dataTypeWarnings[key]) {
            dataTypeWarnings[key] = true
            console.warn('WARNING: Data type definition missing recommended "constructors" property for type "' + type + '" and format "' + format + '".')
          }
        }
      }

      // store the definition
      dataTypes[type][format] = Object.assign({}, definition, { type, format })

      return this
    },

    inheritsFrom (controller: Controller): Controller {
      const index = extendsList.indexOf(controller)
      if (index === -1) extendsList.push(controller)
      return this
    },

    getDefinition<SchemaType> (type: string, format?: string): DefinitionPlus<SchemaType> {
      if (format === undefined) format = ''
      if (dataTypes[type] === undefined) {
        const length = extendsList.length
        for (let i = 0; i < length; i++) {
          const def = extendsList[i].getDefinition(type, format)
          if (def !== undefined) return def
        }
      }
      let definition = dataTypes[type][format]
      if (definition === undefined && format !== '') definition = this.getDefinition(type, '')
      return definition
    },

    getFormats (type: string): string[] {
      const formats = dataTypes[type] !== undefined ? Object.keys(dataTypes[type]) : []
      const length = extendsList.length
      for (let i = 0; i < length; i++) {
        formats.push(...extendsList[i].getFormats(type))
      }
      return formats
    },

    getTypes (): string[] {
      const types = Object.keys(dataTypes)
      const length = extendsList.length
      for (let i = 0; i < length; i++) {
        types.push(...extendsList[i].getTypes())
      }
      return types
    }
  }
}
