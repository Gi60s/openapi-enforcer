import rx from '../rx'
import { getLocation } from '../Locator/Locator'
import { ISchemaProcessor } from './ISchemaProcessor'
import { smart } from '../util'
import {
  IParameter2Definition, IParameter3Definition,
  IPathItem2, IPathItem3, IPathItem2Definition, IPathItem3Definition,
  IOperation2, IOperation3, IOperation2Definition, IOperation3Definition
} from './'

type IPathItem = IPathItem2 | IPathItem3
type IPathItemDefinition = IPathItem2Definition | IPathItem3Definition
type IOperation = IOperation2 | IOperation3
type IOperationDefinition = IOperation2Definition | IOperation3Definition
type IParameterDefinition = IParameter2Definition | IParameter3Definition

export function isUrl (key: string, data: ISchemaProcessor): void {
  const { exception } = data.root
  const { definition, id, reference } = data.cmp
  const url = definition[key]
  if (url !== undefined && !rx.url.test(url)) {
    exception.add({
      id: id + '_URL_INVALID',
      level: 'warn',
      locations: [getLocation(definition, key, 'value')],
      message: 'URL appears to be invalid: ' + smart(url),
      metadata: {
        url: url
      },
      reference
    })
  }
}

export function parametersAreUnique (data: ISchemaProcessor<IPathItemDefinition, IPathItem> | ISchemaProcessor<IOperationDefinition, IOperation>): void {
  const { exception } = data.root
  const { definition, id, reference } = data.cmp
  const existing: Record<string, Record<string, IParameterDefinition[]>> = {}
  definition.parameters?.forEach((parameter, index) => {
    const name = parameter.name
    const at = parameter.in
    if (existing[name] === undefined) {
      existing[name] = {}
    }
    if (existing[name][at] === undefined) {
      existing[name][at] = []
    }
    existing[name][at].push(parameter)
  })

  Object.keys(existing).forEach(name => {
    Object.keys(existing[name]).forEach(at => {
      const parameters = existing[name][at]
      if (parameters.length > 0) {
        exception.add({
          id: id + '_PARAMETERS_CONFLICT',
          level: 'error',
          locations: parameters.map(parameter => {
            // @ts-expect-error
            const index = definition.parameters?.indexOf(parameter)
            return getLocation(parameters, index, 'value')
          }),
          message: 'Found on or more parameter conflicts. Parameters cannot share the same "name" and "in" values.',
          metadata: { parameters },
          reference
        })
      }
    })
  })
}

export function mutuallyExclusiveProperties (properties: string[], data: ISchemaProcessor): void {
  const { exception } = data.root
  const { definition, id, reference } = data.cmp
  const propertiesFound: string[] = []
  properties.forEach(property => {
    if (definition[property] !== undefined) {
      propertiesFound.push(property)
    }
  })

  if (propertiesFound.length > 1) {
    exception.add({
      id: id + '_PROPERTY_CONFLICT',
      level: 'error',
      locations: propertiesFound.map(p => getLocation(definition, p, 'key')),
      message: 'These properties are mutually exclusive: ' + smart(propertiesFound),
      metadata: { properties: propertiesFound },
      reference
    })
  }
}

/*

export function propertiesMutuallyExclusive (data: Data, properties: string[]): IExceptionData {
  const { componentId, definition, reference } = data
  return {
    id: componentId + '_PROPERTY_CONFLICT',
    level: 'error',
    locations: properties.map(p => getLocation(definition, p, 'key')),
    message: 'These properties are mutually exclusive: ' + smart(properties),
    metadata: { properties },
    reference
  }
}
 */
