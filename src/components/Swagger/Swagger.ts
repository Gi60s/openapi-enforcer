/* eslint-disable import/no-duplicates */
import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ISwaggerDefinition, ISwaggerBase } from './ISwagger'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export abstract class Swagger extends EnforcerComponent<ISwaggerDefinition> implements ISwaggerBase {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  protected constructor (definition: ISwaggerDefinition, version?: IVersion, processor?: SchemaProcessor) {
    super(definition, version, processor)
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  // <!# Custom Content Begin: METHODS #!>
  // Put your code here.
  // <!# Custom Content End: METHODS #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
