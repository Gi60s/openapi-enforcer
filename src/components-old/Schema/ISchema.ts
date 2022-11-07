import { IComponentClass } from '../IComponent'

export interface IPartialSchema<Definition, Items> extends IComponentClass<Definition, Items> {
  [key: `x${string}`]: any
  default?: any
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Items
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number
  minimum?: number
  multipleOf?: number
  pattern?: RegExp
  type?: string
  uniqueItems?: boolean
}

export interface IPartialSchemaDefinition<Items> {
  [key: `x-${string}`]: any
  default?: any
  enum?: any[]
  exclusiveMaximum?: boolean
  exclusiveMinimum?: boolean
  format?: string
  items?: Items
  maxItems?: number
  minItems?: number
  maxLength?: number
  minLength?: number
  maximum?: number | string
  minimum?: number | string
  multipleOf?: number | string
  pattern?: string
  type?: string
  uniqueItems?: boolean
}
