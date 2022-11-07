import { IExceptionLevel } from '../Exception/IException'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { IComponentSchemaObject } from './IComponentSchema'
import { ISchemaProcessor } from './ISchemaProcessor'
export { IExceptionLevel } from '../Exception/IException'
export { ExceptionStore } from '../Exception/ExceptionStore'
export { IComponentSchemaObject } from './IComponentSchema'

export interface IComponentClass<Definition, ComponentInstance> {
  new (definition: Definition, version?: IVersion, data?: ISchemaProcessor): ComponentInstance
  getSchema: (data: ISchemaProcessor) => IComponentSchemaObject
  spec: IComponentSpec
  validate: (definition: any, version?: IVersion, data?: ISchemaProcessor) => ExceptionStore
}

export interface IComponentInstance {
  [extension: `x${string}`]: any
}

// if an openapi extension of x-enforcer is found then the value will have this interface
export interface IEnforcerExtensionDefinition {
  exceptions?: Record<string, IExceptionLevel> // the key is the id to modify the level on and the value is the new level
  nullable?: boolean
}

// string is reference to spec, true means it's supported but not by this version of the component
// false means that the component is not supported for this version
export type IComponentSpec = Record<IVersion, string | boolean>

export type IVersion = '2.0' | '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
