import * as Discriminator from './components/Discriminator'
import * as ExternalDocumentation from './components/ExternalDocumentation'
import * as Xml from './components/Xml'

// DEFINITION TYPES

export type Definition = Definition2 | Definition3
export type Definition2 = Definition2AllOf | Definition2Array | Definition2Boolean | Definition2Integer | Definition2Number | Definition2Object | Definition2String
export type Definition3 = Definition3AllOf | Definition3AnyOf | Definition3Array | Definition3Boolean | Definition3Integer | Definition3Number | Definition3Not | Definition3OneOf | Definition3Object | Definition3String

export type Definition2AllOf = Definition2Fixed & DefinitionAllOf<Definition2>
export type Definition2Array = Definition2Fixed & DefinitionArray<Definition2>
export type Definition2Boolean = Definition2Fixed & DefinitionBoolean
export type Definition2Integer = Definition2Fixed & DefinitionInteger
export type Definition2Number = Definition2Fixed & DefinitionNumber
export type Definition2Object = Definition2Fixed & DefinitionObject<Definition2>
export type Definition2String = Definition2Fixed & DefinitionString

export type Definition3AllOf = Definition3Fixed & DefinitionAllOf<Definition3>
export type Definition3AnyOf = Definition3Fixed & DefinitionAnyOf
export type Definition3Array = Definition3Fixed & DefinitionArray<Definition3>
export type Definition3Boolean = Definition3Fixed & DefinitionBoolean
export type Definition3Integer = Definition3Fixed & DefinitionInteger
export type Definition3Number = Definition3Fixed & DefinitionNumber
export type Definition3Not = Definition3Fixed & DefinitionNot
export type Definition3OneOf = Definition3Fixed & DefinitionOneOf
export type Definition3Object = Definition3Fixed & DefinitionObject<Definition3>
export type Definition3String = Definition3Fixed & DefinitionString

export interface DefinitionBase {
  type: string
  example?: any
  externalDocs?: ExternalDocumentation.Definition
  readOnly?: boolean
  xml?: Xml.Definition
}

export interface Definition2Fixed extends DefinitionBase {
  discriminator?: string
}

export interface Definition3Fixed extends DefinitionBase {
  deprecated?: boolean // default: false
  discriminator?: Discriminator.Definition
  nullable?: boolean
  writeOnly?: boolean
}

export interface DefinitionAllOf<Definition=Definition2|Definition3> {
  allOf: Definition[]
}

export interface DefinitionAnyOf {
  anyOf: Definition3[]
}

export interface DefinitionArray<Definition=Definition2|Definition3> {
  type: 'array'
  default?: any[]
  items: Definition
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
}

export interface DefinitionBoolean {
  type: 'boolean'
  default?: true | false
}

export interface DefinitionNumeric<Type> {
  type: Type
  default?: number
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  maximum?: number
  minimum?: number
  multipleOf?: number
}
export type DefinitionInteger = DefinitionNumeric<'integer'>
export type DefinitionNumber = DefinitionNumeric<'number'>

export interface DefinitionNot {
  not: Definition3
}

export interface DefinitionOneOf {
  oneOf: Definition3
}

export interface DefinitionObject<Definition=Definition2|Definition3> {
  type: 'object'
  default?: object
  additionalProperties?: Definition
  maxProperties?: number
  minProperties?: number
  properties?: {
    [key: string]: Definition
  }
  required?: string[]
}

export interface DefinitionString {
  type: 'string'
  default?: string
  maxLength?: string
  minLength?: string
  pattern?: string
}

// OBJECT TYPES

export type Object = Object2 | Object3
export type Object2 = Object2AllOf | Object2Array | Object2Boolean | Object2Integer | Object2Number | Object2Object | Object2String
export type Object3 = Object3AllOf | Object3AnyOf | Object3Array | Object3Boolean | Object3Integer | Object3Number | Object3Not | Object3OneOf | Object3Object | Object3String

export type Object2AllOf = Object2Fixed & ObjectAllOf<Object2>
export type Object2Array = Object2Fixed & ObjectArray<Object2>
export type Object2Boolean = Object2Fixed & ObjectBoolean
export type Object2Integer = Object2Fixed & ObjectInteger
export type Object2Number = Object2Fixed & ObjectNumber
export type Object2Object = Object2Fixed & ObjectObject<Object2>
export type Object2String = Object2Fixed & ObjectString

export type Object3AllOf = Object3Fixed & ObjectAllOf<Object3>
export type Object3AnyOf = Object3Fixed & ObjectAnyOf
export type Object3Array = Object3Fixed & ObjectArray<Object3>
export type Object3Boolean = Object3Fixed & ObjectBoolean
export type Object3Integer = Object3Fixed & ObjectInteger
export type Object3Number = Object3Fixed & ObjectNumber
export type Object3Not = Object3Fixed & ObjectNot
export type Object3OneOf = Object3Fixed & ObjectOneOf
export type Object3Object = Object3Fixed & ObjectObject<Object3>
export type Object3String = Object3Fixed & ObjectString

export interface ObjectBase {
  type: string
  example: any
  externalDocs?: ExternalDocumentation.Object
  readOnly?: boolean
  xml?: Xml.Object
}

export interface Object2Fixed extends ObjectBase {
  discriminator?: string
}

export interface Object3Fixed extends ObjectBase {
  deprecated?: boolean // default: false
  discriminator?: Discriminator.Object
  nullable?: boolean
  writeOnly?: boolean
}

export interface ObjectAllOf<Object=Object2|Object3> {
  allOf: Object[]
}

export interface ObjectAnyOf {
  anyOf: Object3[]
}

export interface ObjectArray<Object=Object2|Object3> {
  type: 'array'
  default?: any[]
  items: Object
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
}

export interface ObjectBoolean {
  type: 'boolean'
  default?: true | false
}

export interface ObjectNumeric<Type=string> {
  type: Type
  default?: number
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  maximum?: number
  minimum?: number
  multipleOf?: number
}
export type ObjectInteger = ObjectNumeric<'integer'>
export type ObjectNumber = ObjectNumeric<'number'>

export interface ObjectNot {
  not: Object3
}

export interface ObjectOneOf {
  oneOf: Object3
}

export interface ObjectObject<Object=Object2|Object3> {
  type: 'object'
  default?: object
  additionalProperties?: Object
  maxProperties?: number
  minProperties?: number
  properties?: {
    [key: string]: Object
  }
  required?: string[]
}

export interface ObjectString {
  type: 'string'
  default?: string
  maxLength?: string
  minLength?: string
  pattern?: string
}
