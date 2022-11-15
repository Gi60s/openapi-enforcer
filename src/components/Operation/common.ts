import { ISchemaProcessor } from '../ISchemaProcessor'
import { parametersAreUnique, parametersNotInPath } from '../validations'
import {
  IOperation, IOperationDefinition,
  IParameter, IParameterDefinition,
  IPathItem, IPathItemDefinition,
  IPaths, IPathsDefinition
} from '../IInternalTypes'
import { findAncestorComponentData } from '../common'
import { getPathParameterNames } from '../Paths/common'
import { Result } from '../../Result'
import { getLocation } from '../../Locator/Locator'
import { smart } from '../../util'

type IFromParameterArray = Array<IParameter | IParameterDefinition>

const mergedParametersMap = new WeakMap<IOperationDefinition, IFromParameterArray>()

export function after (context: IOperationDefinition, data: ISchemaProcessor<IOperationDefinition, IOperation>, mode: 'build' | 'validate'): void {
  const { chain, definition, exception, id, key: path, lastly, reference, store } = data

  // TODO: make sure we're getting the path item when there is one
  const mergedParameters = getMergedParameters(data)
  if (mode === 'validate') {
    parametersAreUnique(data)

    // check that parameters in path and parameters (as array) for path parameters are in agreement
    const mergedPathParameters = mergedParameters.filter(v => v.in === 'path')
    const pathsComponentData = findAncestorComponentData<IPaths, IPathsDefinition>(chain, 'Paths')
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
        id: id + '_PATH_PARAMETERS_NOT_DEFINED',
        level: 'error',
        locations: [getLocation(definition, 'parameters')],
        message: 'One or more parameters in the path are not defined as path parameters in the Parameters array.',
        metadata: {
          parameterNames: paramNamesInPathNotInParameters
        },
        reference
      })
    }
    parametersNotInPath(data, pathParameterNames)

    if (definition.summary !== undefined && definition.summary.length >= 120) {
      exception.add({
        id: id + '_SUMMERY_EXCEEDS_RECOMMENDED_LENGTH',
        level: 'warn',
        locations: [getLocation(definition, 'summary', 'value')],
        message: 'The summary should be less than 120 characters in length.',
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
      Object.keys(operationIdMap).forEach(id => {
        const operations = operationIdMap[id]
        if (operations.length > 1) {
          exception.add({
            id: id + '_OPERATION_ID_NOT_UNIQUE',
            level: 'error',
            locations: operations.map(def => getLocation(def, 'operationId', 'value')),
            message: 'Each operationId must be unique, but multiple operations have the same operationId: ' + smart(id),
            reference
          })
        }
      })
    })
  }
}

export function getMergedParameters (data: ISchemaProcessor<IOperationDefinition, IOperation>): IFromParameterArray {
  let results = mergedParametersMap.get(data.definition)
  if (results === undefined) {
    const { chain, definition } = data
    const pathItem = findAncestorComponentData<IPathItem, IPathItemDefinition>(chain, 'PathItem')
    const pathItemParameters: IFromParameterArray = pathItem?.definition.parameters ?? []
    const operationParameters: IFromParameterArray = definition.parameters ?? []
    const mergedParameters = pathItemParameters === undefined
      ? operationParameters
      : operationParameters.concat(pathItemParameters.filter(pip => {
        const match = operationParameters.find(op => op.name === pip.name && op.in === pip.in)
        return match === undefined
      }))
    mergedParametersMap.set(data.definition, mergedParameters)
    results = mergedParameters
  }
  return results
}

export function getResponseContentTypeMatches (this: IOperation, code: string, accepts: string): Result<string[]> {
  return new Result<string[]>([])
}
