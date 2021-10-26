import * as loader from './loader'
import * as config from './config'

import * as _2 from './v2'
import * as _3 from './v3'

export {
  config,
  loader
}

// export exception class and interfaces
export {
  Exception,
  ErrorReport as ExceptionErrorReport,
  WarningReport as ExceptionWarningReport,
  OpinionReport as ExceptionOpinionReport,
  IgnoredReport as ExceptionIgnoredReport
} from './Exception'
export { Level as ExceptionLevel, ExceptionMessageData } from './Exception/types'

// export result interface
export { Result } from './Result'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace v2 {
  // TODO: fill out all of the components and definitions
  export type HeaderDefinition = _2.HeaderDefinition
  export const Header = _2.Header
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace v3 {
  // TODO: fill out all of the components and definitions
  export type HeaderDefinition = _3.HeaderDefinition
  export const Header = _3.Header
}

export { base as dataTypes } from './components/helpers/DataTypes'

// take an object and bundle it so that it can be converted to a JSON string
export function bundle (object: any): any {

}

// load a file and optionally dereference it
export async function load (path: string, options?: loader.Options): Promise<unknown> {
  return await loader.load(path, options)
}
