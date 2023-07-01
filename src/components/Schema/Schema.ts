/* eslint-disable import/no-duplicates */
import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ISchemaDefinition, ISchemaBase } from './ISchema'

// <!# Custom Content Begin: HEADER #!>
import {
  ISchemaHookType,
  ISchemaHookHandler,
  ISchemaHookResult,
  ISchemaPopulateOptions, ISchemaRandomOptions, ISchemaValidateOptions, ISchemaSchemaProcessor,
  ISchemaValidatorsMap2, ISchemaValidatorsMap3, ISchemaValidatorsMap3a,
  ISchema,
  ISchema2, ISchema2Definition,
  ISchema3, ISchema3Definition,
  ISchema3a, ISchema3aDefinition
} from './ISchema'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { Result } from '../../Result'
import { ExceptionStore } from '../../Exception/ExceptionStore'

type ISchemaDefinitionResult = ISDSchemaDefinition<ISchema2Definition, ISchema2> | ISDSchemaDefinition<ISchema3Definition, ISchema3> | ISDSchemaDefinition<ISchema3aDefinition, ISchema3a>
type IValidatorsMap = ISchemaValidatorsMap2 | ISchemaValidatorsMap3 | ISchemaValidatorsMap3a

const derivedDefinitionMap = new WeakMap<ISchemaDefinition, ISchemaDefinition>()
// <!# Custom Content End: HEADER #!>

export abstract class Schema extends EnforcerComponent<ISchemaDefinition> implements ISchemaBase {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  protected constructor (definition: ISchemaDefinition, version?: IVersion, processor?: SchemaProcessor) {
    super(definition, version, processor)
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  // <!# Custom Content Begin: METHODS #!>
  hook (type: ISchemaHookType, handler: ISchemaHookHandler): ISchemaHookResult {
    return {
      done: false,
      hasException: false,
      value: null
    }
  }

  deserialize (value: string, options: { strict: boolean } | undefined): any {
    return null
  }

  abstract discriminate (value: object): { key: string, name: string, schema: ISchema }

  populate (params: Record<string, any>, value: object, options?: ISchemaPopulateOptions): Result<object> {
    return new Result({})
  }

  random (value: any, options?: ISchemaRandomOptions): Result<object> {
    return new Result({})
  }

  serialize (value: any): Result {
    return new Result({})
  }

  unhook (type: ISchemaHookType, handler: ISchemaHookHandler): void {

  }

  validate (value: any, options?: ISchemaValidateOptions): ExceptionStore | undefined {
    return undefined
  }

  static commonSchemaDefinition (processor: ISchemaSchemaProcessor, validators: IValidatorsMap, result: ISchemaDefinitionResult): void {
    const { definition, exception } = processor
    const type = determineSchemaType(definition)
    const ctor = processor.component.constructor

    const additionalProperties = validators.additionalProperties
    additionalProperties.notAllowed = type !== 'object' ? 'PROPERTY_NOT_ALLOWED_UNLESS_OBJECT' : undefined

    // TODO: type may be string and format may make it numeric, so due a numeric type lookup here
    validators.maximum.notAllowed = type !== 'number' && type !== 'integer' ? 'PROPERTY_NOT_ALLOWED_UNLESS_NUMERIC' : undefined
    validators.minimum.notAllowed = type !== 'number' && type !== 'integer' ? 'PROPERTY_NOT_ALLOWED_UNLESS_NUMERIC' : undefined
    validators.multipleOf.notAllowed = type !== 'number' && type !== 'integer' ? 'PROPERTY_NOT_ALLOWED_UNLESS_NUMERIC' : undefined

    result.validate = () => {
      const { definition } = processor

      const derived: ISchemaDefinition = Object.assign({}, definition, { type })
      derivedDefinitionMap.set(definition, derived)

      const isTypeExempt = ('allOf' in definition) || ('anyOf' in definition) || ('oneOf' in definition) || ('not' in definition)
      if (!isTypeExempt) {
        if (type === undefined) {
          exception.add({
            code: 'SCHEMA_TYPE_INDETERMINATE',
            id: ctor.id,
            level: 'error',
            locations: [processor.getLocation('value')],
            metadata: {}
          })
        } else if (!('type' in definition)) {
          exception.add({
            code: 'SCHEMA_TYPE_NOT_SPECIFIED',
            id: ctor.id,
            level: 'warn',
            locations: [processor.getLocation('value')],
            metadata: {
              determinedType: type
            }
          })
        }
      }

      if (Array.isArray(definition.allOf) && definition.allOf.length === 0) {
        exception.add({
          code: 'ARRAY_EMPTY',
          id: ctor.id,
          level: 'warn',
          locations: [processor.getLocation('value')],
          metadata: {}
        })
      }

      // if (Array.isArray(definition.allOf)) {
      //   const allOf = (definition.allOf as IDefinition[]).filter((s: any) => !('$ref' in s))
      //
      //     // first check that any properties that must be equal are equal
      //   ;(allOfMustBeEqualProperties as Array<keyof IDefinition>).forEach(key => {
      //     const conflicts: IAllOfData[] = []
      //     let hasConflicts = false
      //     allOf.forEach((definition, index) => {
      //       // it should always get the derived schema because it was set already during the validator of the child schema
      //       const schema = derivedDefinitionMap.get(definition) ?? definition
      //       if (key in schema) {
      //         const value = schema[key]
      //         if (derived[key] === undefined) derived[key] = value
      //         conflicts.push({ definition, value })
      //         if (index > 0 && !deepEqual(conflicts[0].value, value)) hasConflicts = true
      //       }
      //     })
      //
      //     if (hasConflicts) {
      //       exception.add({
      //         code: 'SCHEMA_ALL_CONFLICT',
      //         id: ctor.id,
      //         level: 'error',
      //         locations: conflicts.map(conflict => getLocation(conflict.definition, key, 'value')),
      //         metadata: {
      //           propertyName: key,
      //           values: Array.from(new Set(conflicts.map(c => c.value)))
      //         }
      //       })
      //     }
      //   })
      //
      //   if (derived.type === 'object') {
      //     const conflicts: IAllOfData[] = []
      //     allOfDeepObjectComparison(allOf, conflicts)
      //   }
      // }

      // TODO: additional validations
    }
  }
  // <!# Custom Content End: METHODS #!>
}

// <!# Custom Content Begin: FOOTER #!>
function determineSchemaType (definition: ISchemaDefinition | ISchema): 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string' | Array<'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'> | undefined {
  if (definition.type !== undefined) return definition.type
  if ('items' in definition ||
    'maxItems' in definition ||
    'minItems' in definition ||
    'uniqueItems' in definition ||
    Array.isArray(definition.default) ||
    Array.isArray(definition.enum?.[0])) return 'array'
  if ('additionalProperties' in definition ||
    'discriminator' in definition ||
    'properties' in definition ||
    'maxProperties' in definition ||
    'minProperties' in definition ||
    'required' in definition ||
    (typeof definition.default === 'object' && definition.default !== null) ||
    (typeof definition.enum?.[0] === 'object' && definition.enum[0] !== null)) return 'object'
  if ('maximum' in definition ||
    'minimum' in definition ||
    'exclusiveMaximum' in definition ||
    'exclusiveMinimum' in definition ||
    'multipleOf' in definition ||
    typeof definition.default === 'number' ||
    typeof definition.enum?.[0] === 'number') return 'number'
  if ('maxLength' in definition ||
    'minLength' in definition ||
    'pattern' in definition ||
    typeof definition.default === 'string' ||
    typeof definition.enum?.[0] === 'string') return 'string'
  if (typeof definition.default === 'boolean' ||
    typeof definition.enum?.[0] === 'boolean') return 'boolean'
}
// <!# Custom Content End: FOOTER #!>
