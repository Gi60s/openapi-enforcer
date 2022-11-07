import { ISchema3 } from './ISchema'
import { IComponentInstance } from '../IComponent'

export interface IDiscriminator3 extends IComponentInstance {
  propertyName: string
  mapping?: Record<string, ISchema3>
}

export interface IDiscriminator3Definition {
  [key: `x-${string}`]: any
  propertyName: string
  mapping?: Record<string, string>
}
