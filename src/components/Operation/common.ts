import { ISchemaProcessor } from '../../ComponentSchemaDefinition/ISchemaProcessor'
import { parametersAreUnique, parametersNotInPath } from '../validations'
import {
  IOperationDefinition,
  IParameter, IParameterDefinition
} from '../IInternalTypes'
import { IOperation2, IOperation2Definition, IOperation3, IOperation3Definition } from '../'
import { getPathParameterNames } from '../Paths/common'
import { getLocation } from '../../Locator/Locator'
import { ContentType } from '../../ContentType/ContentType'

type IFromParameterArray = Array<IParameter | IParameterDefinition>
type ISchemaProcessorData = ISchemaProcessor<IOperation2Definition, IOperation2> | ISchemaProcessor<IOperation3Definition, IOperation3>

const mergedParametersMap = new WeakMap<IOperationDefinition, IFromParameterArray>()

export function validate (data: ISchemaProcessorData, mergedParameters: IFromParameterArray): void {
  const { chain, definition, exception, id, key: path, lastly, reference, store } = data

  // TODO: make sure we're getting the path item when there is one
  parametersAreUnique(data)

  // check that parameters in path and parameters (as array) for path parameters are in agreement
  const mergedPathParameters = mergedParameters.filter(v => v.in === 'path')
  const pathsComponentData = chain.getAncestor('Paths')
  const paramNamesInPathNotInParameters: string[] = []
  const pathParameterNames: string[] = pathsComponentData !== undefined
    ? getPathParameterNames(pathsComponentData.definition, path)
    : []
  pathParameterNames.forEach(name => {
    const found = mergedPathParameters.find(p => p.name === name)
    if (found === undefined) {
      paramNamesInPathNotInParameters.push(name)
    }
  })
  if (paramNamesInPathNotInParameters.length > 0) {
    exception.add({
      id,
      code: 'PARAMETER_PATH_NOT_DEFINED',
      level: 'error',
      locations: [getLocation(definition, 'parameters')],
      metadata: {
        parameterNames: paramNamesInPathNotInParameters
      },
      reference
    })
  }
  parametersNotInPath(data, pathParameterNames)

  if (definition.summary !== undefined && definition.summary.length >= 120) {
    exception.add({
      id,
      code: 'SUMMERY_EXCEEDS_RECOMMENDED_LENGTH',
      level: 'warn',
      locations: [getLocation(definition, 'summary', 'value')],
      metadata: { summary: definition.summary },
      reference
    })
  }

  store.operations.push(data)
  lastly.addSingleton(id, () => {
    // look for duplicate operation ids
    const operationIdMap: Record<string, IOperationDefinition[]> = {}
    store.operations.forEach(operationData => {
      const id = operationData.id
      const operation = operationData.definition
      if (operationIdMap[id] === undefined) {
        operationIdMap[id] = [operation]
      } else {
        operationIdMap[id].push(operation)
      }
    })
    Object.keys(operationIdMap).forEach(operationId => {
      const operations = operationIdMap[operationId]
      if (operations.length > 1) {
        exception.add({
          id,
          code: 'OPERATION_ID_NOT_UNIQUE',
          level: 'error',
          locations: operations.map(def => getLocation(def, 'operationId', 'value')),
          metadata: {
            operationId
          },
          reference
        })
      }
    })
  })
}

export function getMergedParameters (data: ISchemaProcessorData): IFromParameterArray {
  let results = mergedParametersMap.get(data.definition)
  if (results === undefined) {
    const { chain, definition } = data
    const pathItem = chain.getAncestor('PathItem')
    const pathItemParameters: IFromParameterArray = pathItem?.definition.parameters ?? []
    const operationParameters: IFromParameterArray = ((definition.parameters ?? []) as IParameterDefinition[])
      .filter((p: any) => !('$ref' in p))
    results = mergeParameters(pathItemParameters, operationParameters)
  }
  return results
}

export function mergeParameters (...sets: Array<IFromParameterArray | undefined>): IFromParameterArray {
  const results: IFromParameterArray = []
  sets.forEach(set => {
    set?.forEach(parameter => {
      const index = results.findIndex(p => p.name === parameter.name && p.in === parameter.in)
      if (index !== -1) {
        results.splice(index, 1, parameter)
      } else {
        results.push(parameter)
      }
    })
  })
  return results
}

export function operationWillAcceptContentType (contentType: string | ContentType, consumes: string[]): boolean {
  const length = consumes.length
  for (let i = 0; i < length; i++) {
    const type = ContentType.fromString(consumes[i])
    if (type?.isMatch(contentType) ?? false) return true
  }
  return false
}
