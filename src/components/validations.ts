import rx from '../rx'
import { getLocation } from '../Locator/Locator'
import { ISchemaProcessor } from '../ComponentSchemaDefinition/ISchemaProcessor'
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
      id,
      code: 'URL_INVALID',
      level: 'warn',
      locations: [getLocation(definition, key, 'value')],
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
  definition.parameters?.forEach((parameter) => {
    if (!('$ref' in parameter)) {
      const name = parameter.name
      const at = parameter.in
      if (existing[name] === undefined) {
        existing[name] = {}
      }
      if (existing[name][at] === undefined) {
        existing[name][at] = []
      }
      existing[name][at].push(parameter)
    }
  })

  Object.keys(existing).forEach(name => {
    Object.keys(existing[name]).forEach(at => {
      const parameters = existing[name][at]
      if (parameters.length > 0) {
        exception.add({
          id,
          code: 'PARAMETER_NAMESPACE_CONFLICT',
          level: 'error',
          locations: parameters.map(parameter => {
            // @ts-expect-error
            const index = definition.parameters?.indexOf(parameter)
            return getLocation(parameters, index, 'value')
          }),
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
        id,
        code: 'PARAMETER_NOT_IN_PATH',
        level: 'error',
        locations: [getLocation(p)],
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
      id,
      code: 'PROPERTIES_MUTUALLY_EXCLUSIVE',
      level: 'error',
      locations: propertiesFound.map(p => getLocation(definition, p, 'key')),
      metadata: {
        propertyNames: propertiesFound
      },
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
