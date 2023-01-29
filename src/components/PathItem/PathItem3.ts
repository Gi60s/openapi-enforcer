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

let cachedSchema: ISchema.ISchemaDefinition<I.IPathItem3Definition, I.IPathItem3> | null = null

interface IValidatorsMap {
  $ref: ISchema.IProperty<ISchema.IString>
  summary: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  get: ISchema.IProperty<ISchema.IComponent<I.IOperation3Definition, I.IOperation3>>
  put: ISchema.IProperty<ISchema.IComponent<I.IOperation3Definition, I.IOperation3>>
  post: ISchema.IProperty<ISchema.IComponent<I.IOperation3Definition, I.IOperation3>>
  _delete: ISchema.IProperty<ISchema.IComponent<I.IOperation3Definition, I.IOperation3>>
  options: ISchema.IProperty<ISchema.IComponent<I.IOperation3Definition, I.IOperation3>>
  head: ISchema.IProperty<ISchema.IComponent<I.IOperation3Definition, I.IOperation3>>
  patch: ISchema.IProperty<ISchema.IComponent<I.IOperation3Definition, I.IOperation3>>
  trace: ISchema.IProperty<ISchema.IComponent<I.IOperation3Definition, I.IOperation3>>
  servers: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.IServer3Definition, I.IServer3>>>
  parameters: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.IParameter3Definition, I.IParameter3>>>
}

export class PathItem extends EnforcerComponent<I.IPathItem3Definition> implements I.IPathItem3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IPathItem3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'PATH_ITEM3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#path-item-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#path-item-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#path-item-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#path-item-object'
  }

  static getSchemaDefinition (_data: I.IPathItemSchemaProcessor): ISchema.ISchemaDefinition<I.IPathItem3Definition, I.IPathItem3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IPathItem3Definition, I.IPathItem3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.$ref,
        validators.summary,
        validators.description,
        validators.get,
        validators.put,
        validators.post,
        validators._delete,
        validators.options,
        validators.head,
        validators.patch,
        validators.trace,
        validators.servers,
        validators.parameters
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.validate = validate
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IPathItem3Definition> | PathItem | undefined): PathItem {
    return new PathItem(Object.assign({}, definition) as I.IPathItem3Definition)
  }

  static createDefinition (definition?: Partial<I.IPathItem3Definition> | undefined): I.IPathItem3Definition {
    return Object.assign({}, definition) as I.IPathItem3Definition
  }

  static validate (definition: I.IPathItem3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get $ref (): string | undefined {
    return this[GetProperty]('$ref')
  }

  set $ref (value: string | undefined) {
    this[SetProperty]('$ref', value)
  }

  get summary (): string | undefined {
    return this[GetProperty]('summary')
  }

  set summary (value: string | undefined) {
    this[SetProperty]('summary', value)
  }

  get description (): string | undefined {
    return this[GetProperty]('description')
  }

  set description (value: string | undefined) {
    this[SetProperty]('description', value)
  }

  get get (): I.IOperation3 | undefined {
    return this[GetProperty]('get')
  }

  set get (value: I.IOperation3 | undefined) {
    this[SetProperty]('get', value)
  }

  get put (): I.IOperation3 | undefined {
    return this[GetProperty]('put')
  }

  set put (value: I.IOperation3 | undefined) {
    this[SetProperty]('put', value)
  }

  get post (): I.IOperation3 | undefined {
    return this[GetProperty]('post')
  }

  set post (value: I.IOperation3 | undefined) {
    this[SetProperty]('post', value)
  }

  get delete (): I.IOperation3 | undefined {
    return this[GetProperty]('delete')
  }

  set delete (value: I.IOperation3 | undefined) {
    this[SetProperty]('delete', value)
  }

  get options (): I.IOperation3 | undefined {
    return this[GetProperty]('options')
  }

  set options (value: I.IOperation3 | undefined) {
    this[SetProperty]('options', value)
  }

  get head (): I.IOperation3 | undefined {
    return this[GetProperty]('head')
  }

  set head (value: I.IOperation3 | undefined) {
    this[SetProperty]('head', value)
  }

  get patch (): I.IOperation3 | undefined {
    return this[GetProperty]('patch')
  }

  set patch (value: I.IOperation3 | undefined) {
    this[SetProperty]('patch', value)
  }

  get trace (): I.IOperation3 | undefined {
    return this[GetProperty]('trace')
  }

  set trace (value: I.IOperation3 | undefined) {
    this[SetProperty]('trace', value)
  }

  get servers (): I.IServer3[] | undefined {
    return this[GetProperty]('servers')
  }

  set servers (value: I.IServer3[] | undefined) {
    this[SetProperty]('servers', value)
  }

  get parameters (): I.IParameter3[] | undefined {
    return this[GetProperty]('parameters')
  }

  set parameters (value: I.IParameter3[] | undefined) {
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
    summary: {
      name: 'summary',
      schema: {
        type: 'string'
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    get: {
      name: 'get',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation3
      }
    },
    put: {
      name: 'put',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation3
      }
    },
    post: {
      name: 'post',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation3
      }
    },
    _delete: {
      name: 'delete',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation3
      }
    },
    options: {
      name: 'options',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation3
      }
    },
    head: {
      name: 'head',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation3
      }
    },
    patch: {
      name: 'patch',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation3
      }
    },
    trace: {
      name: 'trace',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Operation3
      }
    },
    servers: {
      name: 'servers',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: I.Server3
        }
      }
    },
    parameters: {
      name: 'parameters',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: I.Parameter3
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
