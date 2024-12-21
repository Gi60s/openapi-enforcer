import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { isUrl } from '../validations'

export const validate = function (data: SchemaProcessor<any, any>): void {
  isUrl('url', data)
}
