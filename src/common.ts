import * as loader from './utils/loader'
import * as config from './utils/config'
import * as random from './components/helpers/randomizer'

export {
  config,
  loader,
  random
}

// export exception class and interfaces
export {
  Exception,
  DefinitionException,
  Level as ExceptionLevel,
  Message as ExceptionMessage,
  ErrorReport,
  WarningReport,
  InfoReport,
  IgnoredReport
} from './Exception'

// export result interface
export { Result } from './utils/Result'

// export dataTypes
export {
  getDataTypeDefinition,
  extendDataTypeDefinition,
  setDataTypeDefinition,
  DataType,
  DataTypeRegistry // useful for expanding typings
} from './components/helpers/schema-data-types'

// take an object and bundle it so that it can be converted to a JSON string
export function bundle (object: any): any {

}

// load a file and optionally dereference it
export async function load (path: string, options?: loader.Options): Promise<unknown> {
  return await loader.load(path, options)
}
