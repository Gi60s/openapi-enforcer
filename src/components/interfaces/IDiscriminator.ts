import { ISchema3 } from './ISchema'

export interface IDiscriminator {
  propertyName: string
  mapping?: Record<string, ISchema3>
}

export interface IDiscriminateResult<T> {
  key: string
  name: string
  schema: T | null
}
