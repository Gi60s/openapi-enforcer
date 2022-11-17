import { Chain } from '../Chain/Chain'
import { ISchemaProcessor } from './ISchemaProcessor'

export function findAncestorComponentData<SchemaProcessor extends ISchemaProcessor> (
  chain: Chain<SchemaProcessor>,
  componentName: string
): SchemaProcessor | undefined {
  return chain.getAncestor(item =>
    item.name === componentName) as SchemaProcessor
}
