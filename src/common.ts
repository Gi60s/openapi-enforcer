import * as loader from './utils/loader'
import * as config from './utils/config'

export {
  config,
  loader
}

// export exception class and interfaces
export {
  DefinitionException,
  ErrorReport as ExceptionErrorReport,
  WarningReport as ExceptionWarningReport,
  OpinionReport as ExceptionOpinionReport,
  IgnoredReport as ExceptionIgnoredReport
} from './DefinitionException'
export { Level as ExceptionLevel, ExceptionMessageData } from './DefinitionException/types'

// export result interface
export { Result } from './utils/Result'

// export dataTypes
export { base as dataTypes } from './components/helpers/DataTypes'

// take an object and bundle it so that it can be converted to a JSON string
export function bundle (object: any): any {

}

// load a file and optionally dereference it
export async function load (path: string, options?: loader.Options): Promise<unknown> {
  return await loader.load(path, options)
}
