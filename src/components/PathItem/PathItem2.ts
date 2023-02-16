/*
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!   IMPORTANT   !!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 *  A portion of this file has been created from a template. You can only edit
 *  content in some regions within this file. Look for a region that begins with
 *  // <!# Custom Content Begin: *** #!>
 *  and ends with
 *  // <!# Custom Content End: *** #!>
 *  where the *** is replaced by a string of some value. Within these custom
 *  content regions you can edit the file without worrying about a loss of your
 *  code.
 */

import { IComponentSpec, IVersion } from '../IComponent'
import { EnforcerComponent, SetProperty, GetProperty } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
import { validate } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IPathItem2Definition, I.IPathItem2> | null = null

interface IValidatorsMap {
  $ref: ISchema.IProperty<ISchema.IString>
  get: ISchema.IProperty<ISchema.IComponent<I.IOperation2Definition, I.IOperation2>>
  put: ISchema.IProperty<ISchema.IComponent<I.IOperation2Definition, I.IOperation2>>
  post: ISchema.IProperty<ISchema.IComponent<I.IOperation2Definition, I.IOperation2>>
  _delete: ISchema.IProperty<ISchema.IComponent<I.IOperation2Definition, I.IOperation2>>
  options: ISchema.IProperty<ISchema.IComponent<I.IOperation2Definition, I.IOperation2>>
  head: ISchema.IProperty<ISchema.IComponent<I.IOperation2Definition, I.IOperation2>>
  patch: ISchema.IProperty<ISchema.IComponent<I.IOperation2Definition, I.IOperation2>>
  parameters: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.IParameter2Definition, I.IParameter2>>>
}

export class PathItem extends EnforcerComponent<I.IPathItem2Definition> implements I.IPathItem2 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IPathItem2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'PATH_ITEM2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#path-item-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.IPathItemSchemaProcessor): ISchema.ISchemaDefinition<I.IPathItem2Definition, I.IPathItem2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IPathItem2Definition, I.IPathItem2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.$ref,
        validators.get,
        validators.put,
        validators.post,
        validators._delete,
        validators.options,
        validators.head,
        validators.patch,
        validators.parameters
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.validate = validate
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IPathItem2Definition> | PathItem | undefined): PathItem {
    return new PathItem(Object.assign({}, definition) as I.IPathItem2Definition)
  }

  static createDefinition<T extends Partial<I.IPathItem2Definition>> (definition?: T | undefined): I.IPathItem2Definition & T {
    return Object.assign({}, definition) as I.IPathItem2Definition & T
  }

  static validate (definition: I.IPathItem2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get $ref (): string | undefined {
    return this[GetProperty]('$ref')
  }

  set $ref (value: string | undefined) {
    this[SetProperty]('$ref', value)
  }

  get get (): I.IOperation2 | undefined {
    return this[GetProperty]('get')
  }

  set get (value: I.IOperation2 | undefined) {
    this[SetProperty]('get', value)
  }

  get put (): I.IOperation2 | undefined {
    return this[GetProperty]('put')
  }

  set put (value: I.IOperation2 | undefined) {
    this[SetProperty]('put', value)
  }

  get post (): I.IOperation2 | undefined {
    return this[GetProperty]('post')
  }

  set post (value: I.IOperation2 | undefined) {
    this[SetProperty]('post', value)
  }

  get delete (): I.IOperation2 | undefined {
    return this[GetProperty]('delete')
  }

  set delete (value: I.IOperation2 | undefined) {
    this[SetProperty]('delete', value)
  }

  get options (): I.IOperation2 | undefined {
    return this[GetProperty]('options')
  }

  set options (value: I.IOperation2 | undefined) {
    this[SetProperty]('options', value)
  }

  get head (): I.IOperation2 | undefined {
    return this[GetProperty]('head')
  }

  set head (value: I.IOperation2 | undefined) {
    this[SetProperty]('head', value)
  }

  get patch (): I.IOperation2 | undefined {
    return this[GetProperty]('patch')
  }

  set patch (value: I.IOperation2 | undefined) {
    this[SetProperty]('patch', value)
  }

  get parameters (): I.IParameter2[] | undefined {
    return this[GetProperty]('parameters')
  }

  set parameters (value: I.IParameter2[] | undefined) {
    this[SetProperty]('parameters', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    $ref: {
      name: '$ref',
      schema: {
        type: 'string'
      }
    },
    get: {
      name: 'get',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation2
      }
    },
    put: {
      name: 'put',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation2
      }
    },
    post: {
      name: 'post',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation2
      }
    },
    _delete: {
      name: 'delete',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation2
      }
    },
    options: {
      name: 'options',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation2
      }
    },
    head: {
      name: 'head',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation2
      }
    },
    patch: {
      name: 'patch',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation2
      }
    },
    parameters: {
      name: 'parameters',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: I.Parameter2
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
