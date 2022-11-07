import { IComponentInstance } from '../IComponent'

interface IContactBase extends IComponentInstance {
  email?: string
  name?: string
  url?: string
}

export interface IContact2 extends IContactBase {}
export interface IContact3 extends IContactBase {}

interface IContactBaseDefinition {
  [key: `x-${string}`]: any
  name?: string
  url?: string
  email?: string
}

export interface IContact2Definition extends IContactBaseDefinition {}
export interface IContact3Definition extends IContactBaseDefinition {}
