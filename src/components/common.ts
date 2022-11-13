import { Chain } from '../Chain/Chain'
import { ISchemaProcessor } from './ISchemaProcessor'
import { IDefinition, IComponent } from './IInternalTypes'

export function findAncestorComponentData<Definition extends IDefinition, Built extends IComponent, Metadata = any> (
  chain: Chain<ISchemaProcessor>,
  componentName: string
): ISchemaProcessor<Definition, Built, Metadata> {
  return chain.getAncestor(item =>
    item.cmp.name === componentName) as ISchemaProcessor<Definition, Built, Metadata>
}
