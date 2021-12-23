import { ValidatorData, ExtendedComponent } from '../index'

export function getAncestorComponent (data: ValidatorData, component: ExtendedComponent): ValidatorData | undefined {
  let { chain } = data.component.data.context
  while (true) {
    const parent = chain[0]
    if (parent === undefined) return
    if (parent.component.constructor === component) return parent.component.data
    chain = parent.component.data.context.chain
  }
}
