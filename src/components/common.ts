import { Chain } from '../Chain/Chain'
import { ISchemaProcessor } from '../ComponentSchemaDefinition/ISchemaProcessor'

export function findAncestorComponentData<SchemaProcessor extends ISchemaProcessor> (
  chain: Chain<ISchemaProcessor>,
  componentName: string
): SchemaProcessor | undefined {
  return chain.getAncestor(item =>
    item.name === componentName) as SchemaProcessor
}
