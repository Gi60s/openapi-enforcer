import * as loader from './utils/loader'
import * as config from './utils/config'
import * as random from './components/helpers/randomizer'

export {
  config,
  loader,
  random
}

// export exception class and interfaces
export { Exception } from './utils/Exception'
export {
  DefinitionException,
  ErrorReport as ExceptionErrorReport,
  WarningReport as ExceptionWarningReport,
  OpinionReport as ExceptionOpinionReport,
  IgnoredReport as ExceptionIgnoredReport
} from './DefinitionException'
export { Level as ExceptionLevel, ExceptionMessageData } from './DefinitionException/types'

// export result interface
export { DefinitionResult } from './DefinitionException/DefinitionResult'

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
