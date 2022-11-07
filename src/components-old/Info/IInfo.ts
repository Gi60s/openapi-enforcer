import { IContact2, IContact2Definition, IContact3, IContact3Definition } from '../Contact/IContact'
import { ILicense2, ILicense3, ILicense2Definition, ILicense3Definition } from './ILicense/ILicense'
import { IComponentClass } from '../IComponent'

interface IInfoBase<Definition, Component> extends IComponentClass<Definition, Component> {
  [key: `x${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact2 | IContact3
  license?: ILicense2 | ILicense3
  version: string
}

export interface IInfo2 extends IInfoBase<IInfo2Definition, IInfo2> {
  contact?: IContact2
  license?: ILicense2
}

export interface IInfo3 extends IInfoBase<IInfo3Definition, IInfo3> {
  contact?: IContact3
  license?: ILicense3
}

interface IInfoBaseDefinition {
  [key: `x-${string}`]: any
  title: string
  description?: string
  termsOfService?: string
  contact?: IContact2Definition | IContact3Definition
  license?: ILicense2Definition | ILicense3Definition
  version: string
}

export interface IInfo2Definition extends IInfoBaseDefinition {
  contact?: IContact2Definition
  license?: ILicense2Definition
}

export interface IInfo3Definition extends IInfoBaseDefinition {
  contact?: IContact3Definition
  license?: ILicense3Definition
}
