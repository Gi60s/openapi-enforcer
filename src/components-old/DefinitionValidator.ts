import { IComponentClass, IVersion } from './IComponent'
import { ExceptionStore } from '../Exception/ExceptionStore'
import { ISchemaProcessorData } from "./ISchemaProcessor";

export function validateDefinition (component: IComponentClass<any, any>, definition: any, version: IVersion, data: ISchemaProcessorData): ExceptionStore {
  const exceptions = new ExceptionStore()

  return exceptions
}
