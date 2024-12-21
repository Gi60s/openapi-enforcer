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
import { Operation3a, IOperation3a } from '../Operation'
import { Parameter3a, IParameter3a } from '../Parameter'
import { Server3a, IServer3a } from '../Server'
import { PathItem as PathItemBase } from './PathItem'
import { IPathItem3a, IPathItem3aDefinition, IPathItem3aSchemaProcessor, IPathItemValidatorsMap3a as IValidatorsMap } from './IPathItem'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IPathItem3aDefinition, IPathItem3a> | null = null

export class PathItem extends PathItemBase implements IPathItem3a {
  public extensions: Record<string, any> = {}
  public $ref?: string
  public summary?: string
  public description?: string
  public get?: IOperation3a
  public put?: IOperation3a
  public post?: IOperation3a
  public delete?: IOperation3a
  public options?: IOperation3a
  public head?: IOperation3a
  public patch?: IOperation3a
  public trace?: IOperation3a
  public servers?: IServer3a[]
  public parameters?: IParameter3a[]

  constructor (definition: IPathItem3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'pathItem'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#path-item-object'
  }

  static getSchemaDefinition (_data: IPathItem3aSchemaProcessor): ISDSchemaDefinition<IPathItem3aDefinition, IPathItem3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IPathItem3aDefinition, IPathItem3a> = {
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
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IPathItem3aDefinition> | PathItem | undefined): PathItem {
    return new PathItem(Object.assign({}, definition) as IPathItem3aDefinition)
  }

  static async createAsync (definition?: Partial<IPathItem3aDefinition> | PathItem | string | undefined): Promise<PathItem> {
    if (definition instanceof PathItem) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IPathItem3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IPathItem3aDefinition>> (definition?: T | undefined): IPathItem3aDefinition & T {
    return Object.assign({}, definition) as IPathItem3aDefinition & T
  }

  static validate (definition: IPathItem3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IPathItem3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
        component: Operation3a
      }
    },
    put: {
      name: 'put',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3a
      }
    },
    post: {
      name: 'post',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3a
      }
    },
    _delete: {
      name: 'delete',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3a
      }
    },
    options: {
      name: 'options',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3a
      }
    },
    head: {
      name: 'head',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3a
      }
    },
    patch: {
      name: 'patch',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3a
      }
    },
    trace: {
      name: 'trace',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3a
      }
    },
    servers: {
      name: 'servers',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: Server3a
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
          component: Parameter3a
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
