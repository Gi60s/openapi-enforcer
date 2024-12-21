/* eslint-disable import/no-duplicates */
import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { IServerVariableDefinition, IServerVariableBase } from './IServerVariable'

// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

export abstract class ServerVariable extends EnforcerComponent<IServerVariableDefinition> implements IServerVariableBase {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  protected constructor (definition: IServerVariableDefinition, version?: IVersion, processor?: SchemaProcessor) {
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
