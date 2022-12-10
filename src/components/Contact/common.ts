import { ISchemaProcessor } from '../../ComponentSchemaDefinition/ISchemaProcessor'
import { isUrl } from '../validations'

export const validate = function (data: ISchemaProcessor<any, any>): void {
  isUrl('url', data)
}
