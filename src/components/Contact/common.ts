import { ISchemaProcessor } from '../../ComponentSchemaDefinition/ISchemaProcessor'
import { isUrl } from '../validations'

export const after = function (data: ISchemaProcessor<any, any>, mode: 'build' | 'validate'): void {
  if (mode === 'validate') {
    isUrl('url', data)
  }
}
