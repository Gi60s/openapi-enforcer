// import { AnyComponent } from './components'
// import { Controller as DataTypes } from './data-type-format/controller'
// import { IBuildMapper } from './BuildMapper'
// import { booleanMapToStringArray, isObject, same, smart, stringArrayToBooleanMap } from './util'
// import { ExceptionSet } from './Exception'
// import * as Registry from './component-registry'
// import * as Operation from './components/Operation'
// import * as SecurityScheme from './components/SecurityScheme'
//
// const rxExtension = /^x-.+/
//
// export interface Data<DefinitionType=any> {
//   // unchanging values
//   map: IBuildMapper
//   metadata: {
//     [key: string]: any
//     operationIdMap?: {
//       [operationId: string]: Data<Operation.Definition>
//     }
//     securitySchemes?: {
//       [name: string]: Data<SecurityScheme.Definition>
//     }
//   }
//   root: Data
//   version: Registry.Details
//
//   // changes per component
//   component: {
//     constructor: AnyComponent
//     dataTypes: DataTypes
//     versions: Registry.Reference
//   }
//
//   // changing values
//   built: any
//   chain: Array<Data<any>>
//   definition: DefinitionType
//   exception: ExceptionSet
//   key: string
//   schema: Schema
// }
//
// interface NotAllowed {
//   name: string
//   reason?: string
// }
//
// export type Schema = SchemaAny | SchemaArray | SchemaBoolean | SchemaComponent<any, any> | SchemaNumber | SchemaString | SchemaObject
//
// interface SchemaBase<Definition, Result> {
//   // Run custom code after valid and built.
//   after?: (data: Data<Definition>) => void
//
//   // Run custom code before validate. Returning false will stop follow up validations.
//   before?: (data: Data<Definition>) => boolean
//
//   // Custom build step
//   build?: (data: Data<Definition>) => any
//
//   // Set the default.
//   default?: (data: Data<Definition>) => Result
//
//   // Get array of possible values.
//   enum?: (data: Data<Definition>) => Result[]
//
//   // Determine if validation should be skipped.
//   ignored?: (data: Data<Definition>) => boolean
//
//   // Determine if value can be null
//   nullable?: (data: Data<Definition>) => boolean
// }
//
// export interface SchemaAny extends SchemaBase<any, any> {
//   type: 'any'
// }
//
// export interface SchemaArray<Definition=any[], Built=any[]> extends SchemaBase<Definition, Built> {
//   type: 'array'
//   items: Schema
// }
//
// export interface SchemaBoolean<Definition=boolean, Built=boolean> extends SchemaBase<Definition, Built> {
//   type: 'boolean'
// }
//
// export interface SchemaComponent<Definition, Built> extends SchemaBase<Definition, Built> {
//   type: 'component'
//   allowsRef: boolean
//   component: AnyComponent
// }
//
// export interface SchemaNumber<Definition=number, Built=number> extends SchemaBase<Definition, Built> {
//   type: 'number'
//   integer?: boolean
//   maximum?: number
//   minimum?: number
// }
//
// export interface SchemaString<Definition=string, Built=string> extends SchemaBase<Definition, Built> {
//   type: 'string'
//   maxLength?: number
//   minLength?: number
// }
//
// export interface SchemaObject<Definition=object> extends SchemaBase<Definition, object> {
//   type: 'object'
//   allowsSchemaExtensions: boolean
//   additionalProperties?: boolean | Schema
//   properties?: SchemaProperty[]
// }
//
// export interface SchemaProperty<SchemaType=Schema, Definition=any> {
//   name: string
//   allowed?: (data: Data<Definition>) => true | string // Whether property is even allowed. Omit `allowed` property to allow by default.
//   required?: (data: Data<Definition>) => boolean
//   schema: SchemaType
//   versions?: string[]
// }
//
// export type SchemaConstructor<Definition> = (data: Data<Definition>) => SchemaObject
//
// export type ValidatorFactory<Definition> = (data: Data<Definition>) => SchemaObject
//
// // schema generator and definition to schema mapper
// const componentMap: WeakMap<AnyComponent, { builder: SchemaConstructor<any>, schemas: WeakMap<any, Schema> }> = new WeakMap()
// export const LookupMap = {
//   get<Definition> (component: AnyComponent, data: Data<Definition>): Schema | undefined {
//     const match = componentMap.get(component)
//     if (match === undefined) throw Error('Invalid component context')
//     let schema = match.schemas.get(data.definition)
//     if (schema !== undefined) {
//       schema = match.builder(data)
//       match.schemas.set(data.definition, schema)
//     }
//     return schema
//   },
//   set<Definition> (component: AnyComponent, builder: SchemaConstructor<Definition>): void {
//     componentMap.set(component, {
//       builder,
//       schemas: new WeakMap()
//     })
//   }
// }
//
// // Returning true will allow the built value to be set, returning false will not set the built value
// export function validateDefinition (data: Data<any>): boolean {
//   const { definition, exception, map, schema } = data
//
//   // run base schema initialize validators
//   const baseValidatorResult = runBaseValidators(data, schema)
//   if (!baseValidatorResult.continue) return baseValidatorResult.set
//
//   if (schema.type === 'any') {
//     data.built = definition
//     if (typeof schema.build === 'function') data.built = schema.build(data)
//     return runAfterValidator(data)
//   } else if (schema.type === 'array') {
//     if (!Array.isArray(definition)) {
//       exception.message('DVTYPE', null, 'an array', smart(definition))
//       return false
//     }
//
//     let success = true
//     if ('items' in schema) {
//       data.built = []
//       definition.forEach((def: any, i: number) => {
//         const key = String(i)
//         const child = buildChildData(data, def, key, schema.items)
//         if (!validateChild(child, key)) success = false
//       })
//     }
//     if (typeof schema.build === 'function') data.built = schema.build(data)
//     return success ? runAfterValidator(data) : false
//   } else if (schema.type === 'boolean') {
//     if (typeof definition !== 'boolean') {
//       exception.message('DVTYPE', null, 'a boolean', smart(definition))
//       return false
//     }
//     data.built = definition
//     if (typeof schema.build === 'function') data.built = schema.build(data)
//     return runAfterValidator(data)
//   } else if (schema.type === 'component') {
//     const component = schema.component
//     const $enforcer = component.$enforcer
//
//     if (!data.isProd) {
//       // ensure component version match
//       if ($enforcer.version.name !== data.version.name) {
//         throw Error(`Component version mismatch. Component of version ${$enforcer.version.name} cannot be a child of a component with version ${data.version.name}`)
//       }
//     }
//
//     // check if refs allowed and ref exists
//     const hasRef = '$ref' in definition
//     if (hasRef && !schema.allowsRef) exception.message('DVCREF', null)
//
//     // TODO: what to do if reference not already dereferenced
//
//     // create a copy of the data
//     const child: Data<any> = {
//       // unchanging values
//       map: data.map,
//       metadata: data.metadata,
//       root: data.root,
//       version: data.version,
//
//       // changing per spec component values - changes inside the validator function if type === 'component'
//       component: {
//         constructor: component,
//         dataTypes: $enforcer.dataTypes,
//         versions: $enforcer.versions
//       },
//
//       // always changing values
//       built: undefined,
//       chain: data.chain,
//       definition,
//       exception: data.exception,
//       key: data.key,
//       schema: $enforcer.validator(data)
//     }
//
//     // validate the component
//     let success = validateDefinition(child)
//
//     // if validated then store built
//     if (success) {
//       data.built = child.built
//       if ('build' in schema) data.built = schema.build(data)
//     }
//
//     // run any custom logic
//     if (success) success = runAfterValidator(child)
//
//     // run any after-validate component hooks
//     const hooks = $enforcer.hooks['after-validate']
//     if (success && hooks.length > 0) {
//       const hookData: Registry.ExtensionData<any, any> = {
//         built: data.built,
//         definition,
//         error: data.exception.error,
//         key: data.key,
//         warning: data.exception.warning
//       }
//       hooks.forEach((hook: Registry.HookFunction<any, any>) => {
//         hook(hookData)
//       })
//       if (hookData.error.hasException) success = false
//     }
//
//     return success
//   } else if (schema.type === 'number') {
//     let success = true
//     if (typeof definition !== 'number') {
//       exception.message('DVTYPE', null, 'a number', smart(definition))
//       return false
//     }
//     if (schema.integer && definition % 1 !== 0) {
//       exception.message('DVNINT', null, smart(definition))
//       success = false
//     }
//     if ('maximum' in schema && definition > schema.maximum!) {
//       exception.message('DVNMAX', null, schema.maximum, smart(definition))
//       success = false
//     }
//     if ('minimum' in schema && definition < schema.minimum!) {
//       exception.message('DVNMIN', null, schema.maximum, smart(definition))
//       success = false
//     }
//     if (!success) return false
//
//     data.built = definition
//     if ('build' in schema) data.built = schema.build(data)
//     return runAfterValidator(data)
//   } else if (schema.type === 'object') {
//     // validate definition type
//     if (!isObject(definition)) {
//       exception.message('DVTYPE', null, 'a non-null object', smart(definition))
//       return false
//     }
//
//     // catch infinite loop and initialize built object
//     data.built = {}
//     if (definition !== null && typeof definition === 'object') {
//       const existing = map.getMappedBuild(definition, schema)
//       if (existing !== undefined) {
//         data.built = existing.built
//         return existing.success
//       }
//       map.setMappedBuild(definition, schema, data.built)
//     }
//
//     // validate named properties and set defaults
//     const schemaProperties = 'properties' in schema ? schema.properties : []
//     const requiredProperties = ('required' in schema ? schema.required(data) : [])
//     const missingRequiredMap = stringArrayToBooleanMap(requiredProperties)
//     const validatedPropertiesMap: { [key: string]: boolean } = {}
//     const childrenData: { [key: string]: Data<any, any> } = {}
//     const notAllowed: NotAllowed[] = []
//     let success = true
//     schemaProperties.forEach(prop => {
//       const name = prop.name
//       const child = childrenData[name] = buildChildData(data, definition[name], name, prop.schema)
//       const allowed = prop.allowed === undefined ? true : prop.allowed(child)
//       const versionMismatch = 'versions' in prop ? !versionMatch(data.version, prop.versions) : false
//       if (allowed !== true || versionMismatch) missingRequiredMap[name] = false
//       if (name in definition) {
//         missingRequiredMap[name] = false
//         validatedPropertiesMap[name] = true
//         if (versionMismatch) {
//           notAllowed.push({
//             name,
//             reason: 'Not part of OpenAPI specification version ' + data.version
//           })
//         } else {
//           if (allowed !== true) {
//             notAllowed.push({
//               name,
//               reason: allowed
//             })
//           } else if (!validateChild(child, name)) {
//             success = false
//           }
//         }
//       } else if (prop.schema.default !== undefined) {
//         if (validateChild(child, name)) {
//           if (child.built !== undefined) data.built[name] = child.built
//         } else {
//           success = false
//         }
//       }
//     })
//
//     // validate other definition properties
//     const additionalProperties = 'additionalProperties' in schema ? schema.additionalProperties : false
//     const allowsSchemaExtensions = schema.allowsSchemaExtensions
//     Object.keys(definition).forEach(key => {
//       // if property already validated then don't validate against additionalProperties
//       if (validatedPropertiesMap[key]) return
//
//       // remove from missing required
//       missingRequiredMap[key] = false
//
//       // if a schema extension
//       if (rxExtension.test(key)) {
//         if (!allowsSchemaExtensions) exception.message('DVOEXT', key)
//         return
//       }
//
//       // validate property
//       const def = definition[key]
//       if (additionalProperties === false) {
//         notAllowed.push({
//           name: key,
//           reason: 'Additional properties not allowed.'
//         })
//       } else if (additionalProperties !== true) {
//         const child = buildChildData(data, def, key, additionalProperties)
//         if (!validateChild(child, key)) success = false
//       } else {
//         data.built[key] = def
//       }
//     })
//
//     // report any properties that are not allowed
//     if (notAllowed.length > 0) {
//       notAllowed.sort((a: NotAllowed, b: NotAllowed) => a.name < b.name ? -1 : 1)
//       const child = exception.nest('One or more properties not allowed: ')
//       notAllowed.forEach(reason => {
//         child.message('DVPNAL', '', reason.name, reason.reason)
//       })
//       success = false
//     }
//
//     // report on missing required properties
//     const missingRequired = booleanMapToStringArray(missingRequiredMap)
//     if (missingRequired.length > 0) {
//       exception.message('DVPREQ', null, missingRequired.join(', '))
//       success = false
//     }
//
//     // run after validator
//     if (success && schema.after !== undefined) {
//       schema.after(data)
//       if (data.exception.error.hasException) success = false
//     }
//
//     // store whether the validation succeeded and return success
//     map.setMappedBuild(definition, schema, data.built, success)
//     return success
//   } else if (schema.type === 'string') {
//     let success = true
//     if (typeof definition !== 'string') {
//       exception.message('DVTYPE', null, 'a string', smart(definition))
//       return false
//     }
//     if ('maxLength' in schema && definition.length > schema.maxLength) {
//       exception.message('DVSXLN', null, schema.maxLength, smart(definition))
//       success = false
//     }
//     if ('minLength' in schema && definition.length < schema.minLength) {
//       exception.message('DVSNLN', null, schema.minLength, smart(definition))
//       success = false
//     }
//     if (!success) return false
//
//     data.built = definition
//     if ('build' in schema) data.built = schema.build(data)
//
//     return runAfterValidator(data)
//   } else {
//     return false
//   }
// }
//
// function buildChildData (data: Data<any, any>, definition: any, key: string, schema: Schema): Data<any, any> {
//   const chain = data.chain.slice(0)
//   chain.unshift(data)
//
//   return {
//     // unchanging values
//     isProd: data.isProd,
//     map: data.map,
//     metadata: data.metadata,
//     version: data.version,
//
//     // changing per spec component values - changes inside the validator function if type === 'component'
//     component: data.component,
//
//     // always changing values
//     built: undefined,
//     chain,
//     definition,
//     exception: data.exception.at(key),
//     key,
//     schema
//   }
// }
//
// function validateChild (child: Data<any, any>, key: string): boolean {
//   const success = validateDefinition(child)
//   if (success) child.chain[0].built[key] = child.built
//   return success
// }
//
// function versionMatch (current: Registry.Details, versions: string[]) {
//   const { major, minor, patch } = current
//   const length = versions.length
//   for (let i = 0; i < length; i++) {
//     const [a, b, c] = (versions[i] + '.x.x').split('.')
//     if (major === +a && (b === 'x' || minor === +b) && (c === 'x' || patch === +c)) return true
//   }
//   return false
// }
//
// function runAfterValidator (data: Data<any, any>): boolean {
//   if (data.schema.after !== undefined) {
//     // @ts-expect-error
//     data.schema.after(data)
//     if (data.exception.error.hasException) return false
//   }
//   return true
// }
//
// function runBaseValidators (data: Data<any, any>, schema: Schema): { continue: boolean, set: boolean } {
//   const { definition, exception } = data
//
//   // run before hook
//   if (schema.before !== undefined) {
//     // @ts-expect-error
//     const okToContinue = schema.before(data)
//     if (!okToContinue) {
//       return { continue: false, set: !exception.error.hasException }
//     }
//   }
//
//   // if this definition should be ignored
//   if (schema.ignored !== undefined) {
//     // @ts-expect-error
//     if (schema.ignored(data)) {
//       return { continue: false, set: false }
//     }
//   }
//
//   // if null then validate nullable
//   if (definition === null) {
//     // @ts-expect-error
//     if (schema.nullable === undefined || !schema.nullable(data)) {
//       exception.message('DVNNUL', null)
//       return { continue: false, set: false }
//     } else {
//       data.built = null
//       const success = runAfterValidator(data)
//       return { continue: false, set: success }
//     }
//   }
//
//   // if default is used then set it
//   if (definition === undefined && schema.default !== undefined) {
//     // @ts-expect-error
//     const value = schema.default(data)
//     if (value !== undefined) {
//       data.built = value
//       data.definition = value
//     }
//     const success = runAfterValidator(data)
//     return { continue: false, set: success }
//   }
//
//   // if enum is invalid then exit
//   if (schema.enum !== undefined) {
//     // @ts-expect-error
//     const matches = schema.enum(data)
//     const found = matches.find((v: any) => same(v, definition))
//     if (found === undefined) {
//       const expected: string = matches.length > 1 ? 'one of: ' + matches.join(', ') : matches[0]
//       exception.message('DVENUM', null, expected, smart(definition))
//       return { continue: false, set: false }
//     }
//   }
//
//   return { continue: true, set: true }
// }
