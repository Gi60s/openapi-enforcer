import rx from '../rx'
import { getLocation } from '../Loader'
import { SchemaProcessor } from '../ComponentSchemaDefinition/SchemaProcessor'
import {
  IOperation, IOperationDefinition,
  IParameterDefinition,
  IPathItem, IPathItemDefinition
} from './IInternalTypes'

export function isUrl (key: string, data: SchemaProcessor): void {
  const { definition, exception } = data
  const { reference, id } = data.component
  const url = definition[key]
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

export function parametersAreUnique (data: SchemaProcessor<IPathItemDefinition, IPathItem> | SchemaProcessor<IOperationDefinition, IOperation>): void {
  const { definition, exception } = data
  const { reference, id } = data.component
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
      const parameters = existing[name][at].filter(p => !('$ref' in p))
      if (parameters.length > 0) {
        exception.add({
          id,
          code: 'PARAMETER_NAMESPACE_CONFLICT',
          level: 'error',
          locations: parameters.map(parameter => {
            const index = (definition.parameters as IParameterDefinition[])?.indexOf(parameter)
            return getLocation(parameters, index, 'value')
          }),
          metadata: { parameters },
          reference
        })
      }
    })
  })
}

export function parametersNotInPath (data: SchemaProcessor<IOperationDefinition, IOperation> | SchemaProcessor<IPathItemDefinition, IPathItem>, pathParameterNames: string[]): void {
  const { definition, exception } = data
  const { reference, id } = data.component
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

export function mutuallyExclusiveProperties (properties: string[], data: SchemaProcessor): void {
  const { definition, exception } = data
  const { reference, id } = data.component
  const propertiesFound: string[] = []
  properties.forEach(property => {
    if (definition[property] !== undefined) {
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
