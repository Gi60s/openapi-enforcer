import { ISchemaProcessor } from '../ISchemaProcessor'
import { parametersAreUnique } from '../validations'

export const after = function (data: ISchemaProcessor<any, any>, mode: 'build' | 'validate'): void {
  if (mode === 'validate') {
    parametersAreUnique(data)
  }
}
