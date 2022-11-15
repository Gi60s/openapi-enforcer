import rx from '../rx'
import { getLocation } from '../Locator/Locator'
import { ISchemaProcessor } from './ISchemaProcessor'
import { smart } from '../util'
import {
  IOperation, IOperationDefinition,
  IParameterDefinition,
  IPathItem, IPathItemDefinition
} from './IInternalTypes'

export function isUrl (key: string, data: ISchemaProcessor): void {
  const { definition, exception, id, reference } = data
  const url = (definition as any)[key]
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
  const { definition, exception, id, reference } = data
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

export function parametersNotInPath (data: ISchemaProcessor<IOperationDefinition, IOperation> | ISchemaProcessor<IPathItemDefinition, IPathItem>, pathParameterNames: string[]): void {
  const { definition, exception, id, reference } = data
  const parameters = (definition.parameters ?? []) as IParameterDefinition[]
  parameters.forEach((p) => {
    if (p.in === 'path' && !pathParameterNames.includes(p.name)) {
      exception.add({
        id: id + '_DEFINED_PATH_PARAMETER_NOT_IN_PATH',
        level: 'error',
        locations: [getLocation(p)],
        message: 'A path parameter was defined in the parameters array that is not found in the path: ' + smart(p.name),
        metadata: { parameterName: p.name },
        reference
      })
    }
  })
}

export function mutuallyExclusiveProperties (properties: string[], data: ISchemaProcessor): void {
  const { definition, exception, id, reference } = data
  const propertiesFound: string[] = []
  properties.forEach(property => {
    if ((definition as any)[property] !== undefined) {
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
