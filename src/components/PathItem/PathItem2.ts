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

/* eslint-disable import/no-duplicates */
import { IComponentSpec, IVersion } from '../IComponent'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Operation2, IOperation2 } from '../Operation'
import { PathItem as PathItemBase } from './PathItem'
import { IPathItem2, IPathItem2Definition, IPathItem2SchemaProcessor, IPathItemValidatorsMap2 as IValidatorsMap } from './IPathItem'
// <!# Custom Content Begin: HEADER #!>
import { validate } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IPathItem2Definition, IPathItem2> | null = null

export class PathItem extends PathItemBase implements IPathItem2 {
  public extensions: Record<string, any> = {}
  public $ref?: string
  public get?: IOperation2
  public put?: IOperation2
  public post?: IOperation2
  public delete?: IOperation2
  public options?: IOperation2
  public head?: IOperation2
  public patch?: IOperation2
  public parameters?: IParameter2[]

  constructor (definition: IPathItem2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'PATH_ITEM2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#path-item-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IPathItem2SchemaProcessor): ISDSchemaDefinition<IPathItem2Definition, IPathItem2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IPathItem2Definition, IPathItem2> = {
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

  static create (definition?: Partial<IPathItem2Definition> | PathItem | undefined): PathItem {
    return new PathItem(Object.assign({}, definition) as IPathItem2Definition)
  }

  static async createAsync (definition?: Partial<IPathItem2Definition> | PathItem | string | undefined): Promise<PathItem> {
    if (definition instanceof PathItem) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IPathItem2Definition>)
    }
  }

  static createDefinition<T extends Partial<IPathItem2Definition>> (definition?: T | undefined): IPathItem2Definition & T {
    return Object.assign({}, definition) as IPathItem2Definition & T
  }

  static validate (definition: IPathItem2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IPathItem2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

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
        component: Operation2
      }
    },
    put: {
      name: 'put',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    },
    post: {
      name: 'post',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    },
    _delete: {
      name: 'delete',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    },
    options: {
      name: 'options',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    },
    head: {
      name: 'head',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    },
    patch: {
      name: 'patch',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    },
    parameters: {
      name: 'parameters',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: Parameter2
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
