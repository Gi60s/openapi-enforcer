import { ISchemaProcessor } from '../ISchemaProcessor'
import { parametersAreUnique } from '../validations'
import {
  IOperation, IOperationDefinition,
  IParameter, IParameterDefinition,
  IPathItem, IPathItemDefinition
} from '../IInternalTypes'
import { findAncestorComponentData } from '../common'
import { getPathParameterNames } from '../Paths/common'

// type IOperation = IOperation2 | IOperation3
// type IOperationDefinition = IOperation2Definition | IOperation3Definition
// type IParameter = IParameter2 | IParameter3
// type IParameterDefinition = IParameter2Definition | IParameter3Definition
type IFromParameterArray = Array<IParameter | IParameterDefinition>

const mergedParametersMap = new WeakMap<IOperationDefinition, IFromParameterArray>()

export const after = function (this: IOperation, data: ISchemaProcessor<any, any>, mode: 'build' | 'validate'): void {
  const { exception } = data.root
  const { definition, id } = data.cmp
  const { chain, key: path } = data.context

  // TODO: make sure we're getting the path item when there is one
  const pathItem = findAncestorComponentData<IPathItem, IPathItemDefinition>(chain, 'PathItem')
  const pathItemParameters: IFromParameterArray = pathItem?.cmp.definition.parameters ?? []
  const operationParameters: IFromParameterArray = definition.parameters
  const mergedParameters = pathItemParameters === undefined
    ? operationParameters
    : operationParameters.concat(pathItemParameters.filter(pip => {
      const match = operationParameters.find(op => op.name === pip.name && op.in === pip.in)
      return match === undefined
    }))
  mergedParametersMap.set(this, mergedParameters)

  if (mode === 'validate') {
    parametersAreUnique(data)

    const pathsComponentData = findAncestorComponentData(chain, 'Paths')
    const pathParameterNames = pathsComponentData !== undefined
      ? getPathParameterNames(pathsComponentData.cmp.definition, )


    mergedParameters.forEach(parameter => {

      // TODO: make sure path parameters align - that all parameters in path are defined and all defined as parameters are in path
      if (parameter.in === 'path' && !path.includes('{' + parameter.name + '}')) {
        exception.add({
          id: id + '_',
          level: undefined,
          locations: undefined,
          message: '',
          metadata: undefined,
          reference: ''

        })
      }
    })
  }
}
