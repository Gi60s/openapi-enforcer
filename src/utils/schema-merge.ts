// import { Schema2 as Definition2, Schema3 as Definition3 } from '../components/helpers/DefinitionTypes'
// import { Schema as Schema2 } from '../components/v2/Schema'
// import { Schema as Schema3 } from '../components/v3/Schema'
// import { Result } from '../utils/Result'
// import { Exception } from './Exception'
//
// type Definition = Definition2 | Definition3
// type Schema = Schema2 | Schema3
//
// interface MergeResult<T> {
//   exception: Exception
//   value: T | undefined
// }
//
// export function determineType (def: Definition, context: string = ''): string {
//   const tracker = new TypeTracker(context)
//   determineTypeRecursive(def, false, tracker)
//   return tracker.type
// }
//
// export function mergeSchemas<T extends Definition | Schema> (defs: T[], mode: 'allOf' | 'anyOf' | 'oneOf', context: any): Result<T> {
//   const exception = new Exception('Unable to merge schemas:')
//   const { value } = mergeSchemasRecursive(defs, exception, mode, new Map(), context)
//   return new Result(value, exception)
// }
//
// function mergeSchemasRecursive<T extends Definition | Schema> (defs: T[], exception: Exception, mode: 'allOf' | 'anyOf' | 'oneOf', map: Map<T[], MergeResult<T>>, context: any): MergeResult<T> {
//   const exists = map.get(defs)
//   if (exists !== undefined) return exists
//   const newDef: Definition = {}
//   const result = { exception, value: undefined }
//   map.set(defs, result)
//
//   defs.forEach(def => {
//
//   })
//
//   return result
// }
//
// function determineTypeRecursive (def: Definition, negated: boolean, tracker: TypeTracker): void {
//   if (tracker.map.has(def)) return
//   tracker.map.set(def, true)
//
//   if ('$ref' in def) {
//     tracker.unknown()
//   } else if (def.type !== undefined) {
//     tracker.known(def.type)
//   } else if ('discriminator' in def) {
//     // only objects can use the discriminator, so if that property exists then it must be an object
//     tracker.known('object')
//   } else if ('items' in def || 'maxItems' in def || 'minItems' in def || 'uniqueItems' in def) {
//     tracker.known('array')
//   } else if ('additionalProperties' in def || 'properties' in def || 'maxProperties' in def || 'minProperties' in def) {
//     tracker.known('object')
//   } else if ('maxLength' in def || 'minLength' in def || 'pattern' in def) {
//     tracker.known('string')
//   } else if ('maximum' in def || 'minimum' in def || 'exclusiveMaximum' in def || 'exclusiveMinimum' in def || 'multipleOf' in def) {
//     tracker.known('number')
//   } else if ('default' in def) {
//     const value = def.default
//     if (Array.isArray(value)) {
//       tracker.known('array')
//     } else {
//       tracker.known(typeof value)
//     }
//   } else if ('example' in def) {
//     const value = def.example
//     if (Array.isArray(value)) {
//       tracker.known('array')
//     } else {
//       tracker.known(typeof value)
//     }
//   } else if (def.enum !== undefined && def.enum.length > 0) {
//     const value = def.enum[0]
//     if (Array.isArray(value)) {
//       tracker.known('array')
//     } else {
//       tracker.known(typeof value)
//     }
//   } else if (def.allOf !== undefined) {
//     // sort first by easily determined types and last by oneOf or anyOf types
//     const copy = def.allOf.slice(0)
//     copy.sort((a, b) => {
//       // @ts-expect-error
//       if (a.type !== undefined && b.type === undefined) return -1
//       // @ts-expect-error
//       if (a.type === undefined && b.type !== undefined) return 1
//       // @ts-expect-error
//       if (a.not !== undefined && b.not === undefined) return -1
//       // @ts-expect-error
//       if (a.not === undefined && b.not !== undefined) return 1
//       // @ts-expect-error
//       if (a.anyOf === undefined && b.anyOf !== undefined) return -1
//       // @ts-expect-error
//       if (a.oneOf === undefined && b.oneOf !== undefined) return -1
//       // @ts-expect-error
//       if (a.anyOf !== undefined && b.anyOf === undefined) return 1
//       // @ts-expect-error
//       if (a.oneOf !== undefined && b.oneOf === undefined) return 1
//       return -1
//     })
//
//     const context = tracker.context ?? tracker.data.known[0] ?? ''
//     copy.forEach(def => {
//       const t = new TypeTracker(context)
//       determineTypeRecursive(def as Definition, false, t)
//       const type = t.type
//       if (type !== '') {
//         if (negated) {
//           tracker.impossible(t.type)
//         } else {
//           tracker.known(t.type)
//         }
//       }
//     })
//   } else if ('anyOf' in def || 'oneOf' in def) {
//     const key = 'anyOf' in def ? 'anyOf' : 'oneOf'
//     const context = tracker.context ?? tracker.data.known[0] ?? ''
//     const t = new TypeTracker(context)
//     def[key]?.forEach(def => {
//       determineTypeRecursive(def as Definition, false, t)
//     })
//
//     tracker.possible(t.type)
//   } else if ('not' in def && def.not !== undefined) {
//     const t = new TypeTracker()
//     determineTypeRecursive(def.not as Definition3, true, t)
//     if (negated) {
//       tracker.known(t.type)
//     } else {
//       tracker.impossible(t.type)
//     }
//   }
// }
//
// class TypeTracker {
//   public readonly map: Map<Definition, boolean>
//   public readonly context: string
//   public readonly data: {
//     known: string[]
//     impossible: string[]
//     possible: string[]
//   }
//
//   constructor (context: string) {
//     this.context = context
//     this.map = new Map()
//     this.data = {
//       known: [],
//       impossible: [],
//       possible: []
//     }
//   }
//
//   add (type: string, status: 'known' | 'impossible' | 'possible' | 'unknown'): string {
//     if (status === 'unknown' || type === '') return ''
//     const array = this.data[status]
//     const index = array.indexOf(type)
//     if (index === -1) array.push(type)
//     return type
//   }
//
//   known (type: string): string {
//     return this.add(type, 'known')
//   }
//
//   impossible (type: string): string {
//     return this.add(type, 'impossible')
//   }
//
//   possible (type: string): string {
//     return this.add(type, 'possible')
//   }
//
//   unknown (): string {
//     return ''
//   }
//
//   get type (): string {
//     const { known, impossible, possible } = this.data
//     if (known.length > 1) throw Error('One or more types conflict: ' + known.join(', '))
//     if (known.length === 1) return known[0]
//
//     const remaining = possible.length > 0 ? possible.slice(0) : ['array', 'boolean', 'number', 'object', 'string']
//     impossible.forEach(type => {
//       const index = remaining.findIndex(v => v === type)
//       if (index !== -1) remaining.splice(index, 1)
//     })
//
//     if (remaining.length > 1) throw Error('Too many possible types remain: ' + remaining.join(', '))
//     if (remaining.length === 1) return remaining[0]
//     return ''
//   }
// }
