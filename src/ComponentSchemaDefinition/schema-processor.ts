import { ISchemaProcessor } from './ISchemaProcessor'
import { IVersion } from '../components/IComponent'

const store = new WeakMap<any, ISchemaProcessor>()

export function findAncestor<T> (data: ISchemaProcessor, componentName: string): T | undefined {
  return undefined
}

export function generateChildProcessorData (): ISchemaProcessor {

}

export function getExistingProcessorData<Definition=any, Built=any> (definition: any): ISchemaProcessor<Definition, Built> | undefined {
  return store.get(definition) as ISchemaProcessor<Definition, Built>
}

export function initializeProcessorData (definition: any, version: IVersion): ISchemaProcessor {
  const result = {} as unknown as ISchemaProcessor
  store.set(definition, result)
  return result
}
