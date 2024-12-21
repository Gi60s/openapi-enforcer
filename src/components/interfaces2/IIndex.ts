import { IExceptionLevel } from '../../exceptions/IException'
import { BuilderData } from '../../components/helpers/builder-validator-types'
import { Level } from '../../Exception'

export interface IEnforcerComponent<Definition> {
  $: BuilderData<Definition>
  Definition: Definition
  Extensions: { // these are the x-extensions with the x- removed and properties converted to camel case
    [key: string]: any
    nullable?: boolean // x-nullable
  }
  FindAncestor: <T>(component: string) => T | undefined
  FindAncestorData: <Definition=any, Built=any>(component: string) => BuilderData<Definition, Built> | undefined
}

export interface IEnforcerComponentClass<Definition, ComponentConstructor extends IEnforcerComponentClass<any, any>> {
  new (Component: ComponentConstructor, definition: Definition): IEnforcerComponent<Definition>
  spec: Record<string, string>
  schema: any
}

export interface IEnforcerExtensionDefinition {
  exceptions?: Record<string, Level> // the key is the code to modify the level on and the value is the new level
  nullable?: boolean
}
