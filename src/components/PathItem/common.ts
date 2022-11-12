import { IPathItemMethod } from './IPathItem'
import { ISchemaProcessor } from '../ISchemaProcessor'
import { getLocation } from '../../Locator/Locator'
import { parametersAreUnique } from '../validations'

export const after = function (data: ISchemaProcessor<any, any>, mode: 'build' | 'validate'): void {
  if (mode === 'validate') {
    const { exception } = data.root
    const { definition, id } = data.cmp
    if ('$ref' in definition && Object.keys(definition).length > 1) {
      exception.add({
        id: id + '_FIELD_NOT_SUPPORTED',
        level: 'warn',
        locations: [getLocation(definition, '$ref', 'key')],
        message: 'The $ref is not supported when other fields also exist. See issue https://github.com/OAI/OpenAPI-Specification/issues/2635',
        reference: 'https://github.com/OAI/OpenAPI-Specification/issues/2635'
      })
    }

    parametersAreUnique(data)
  }
}

export const methods: IPathItemMethod[] = ['get', 'post', 'put', 'delete', 'options', 'head', 'patch', 'trace']
