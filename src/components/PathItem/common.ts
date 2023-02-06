import { IPathItemMethod } from './IPathItem'
import { SchemaProcessor } from '../../ComponentSchemaDefinition/SchemaProcessor'
import { getLocation } from '../../Locator/Locator'
import { parametersAreUnique } from '../validations'

export const validate = function (data: SchemaProcessor<any, any>): void {
  const { definition, exception } = data
  const { id } = data.component

  if ('$ref' in definition && Object.keys(definition).length > 1) {
    exception.add({
      id,
      code: 'REF_CONFLICT',
      level: 'warn',
      locations: [getLocation(definition, '$ref', 'key')],
      reference: 'https://github.com/OAI/OpenAPI-Specification/issues/2635'
    })
  }

  parametersAreUnique(data)
}

export const methods: IPathItemMethod[] = ['get', 'post', 'put', 'delete', 'options', 'head', 'patch', 'trace']
