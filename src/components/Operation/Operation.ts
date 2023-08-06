/* eslint-disable import/no-duplicates */
import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { IOperationDefinition, IOperationBase } from './IOperation'

// <!# Custom Content Begin: HEADER #!>
import { ContentType } from '../../ContentType/ContentType'
import { IOperationParseOptions, IOperationParseRequest, IOperationParseRequestResponse } from './IOperation'
// <!# Custom Content End: HEADER #!>

export abstract class Operation extends EnforcerComponent<IOperationDefinition> implements IOperationBase {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  protected constructor (definition: IOperationDefinition, version?: IVersion, processor?: SchemaProcessor) {
    super(definition, version, processor)
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  // <!# Custom Content Begin: METHODS #!>
  abstract getAcceptedResponseTypes (statusCode: number | 'default', accepted: string): ContentType[]
  abstract parseBody (body: string | object, options?: IOperationParseOptions): any
  abstract parseHeaders (headers: Record<string, string>, options?: IOperationParseOptions): Record<string, any>
  abstract parsePath (path: string, options?: IOperationParseOptions): Record<string, any>
  abstract parseQuery (query: string, options?: IOperationParseOptions & { allowOtherQueryParameters?: boolean }): Record<string, string | string[] | undefined>
  abstract parseRequest (request: IOperationParseRequest, options?: IOperationParseOptions & { allowOtherQueryParameters?: boolean }): IOperationParseRequestResponse
  abstract willAcceptContentType (contentType: string | ContentType): boolean
  // <!# Custom Content End: METHODS #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
