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
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { IPathItemSchemaProcessor } from '../IInternalTypes'
import {
  IOperation3,
  IOperation3Definition,
  IParameter3,
  IParameter3Definition,
  IPathItem3,
  IPathItem3Definition,
  IServer3,
  IServer3Definition,
  Operation3,
  Parameter3,
  Server3
} from '../'
// <!# Custom Content Begin: HEADER #!>
import { after } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IPathItem3Definition, IPathItem3> | null = null

interface IValidatorsMap {
  $ref: ISchema.IProperty<ISchema.IString>
  summary: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  get: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>>
  put: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>>
  post: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>>
  _delete: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>>
  options: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>>
  head: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>>
  patch: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>>
  trace: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>>
  servers: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<IServer3Definition, IServer3>>>
  parameters: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<IParameter3Definition, IParameter3>>>
}

const validators: IValidatorsMap = {
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
      component: Operation3
    }
  },
  put: {
    name: 'put',
    schema: {
      type: 'component',
      allowsRef: false,
      component: Operation3
    }
  },
  post: {
    name: 'post',
    schema: {
      type: 'component',
      allowsRef: false,
      component: Operation3
    }
  },
  _delete: {
    name: 'delete',
    schema: {
      type: 'component',
      allowsRef: false,
      component: Operation3
    }
  },
  options: {
    name: 'options',
    schema: {
      type: 'component',
      allowsRef: false,
      component: Operation3
    }
  },
  head: {
    name: 'head',
    schema: {
      type: 'component',
      allowsRef: false,
      component: Operation3
    }
  },
  patch: {
    name: 'patch',
    schema: {
      type: 'component',
      allowsRef: false,
      component: Operation3
    }
  },
  trace: {
    name: 'trace',
    schema: {
      type: 'component',
      allowsRef: false,
      component: Operation3
    }
  },
  servers: {
    name: 'servers',
    schema: {
      type: 'array',
      items: {
        type: 'component',
        allowsRef: false,
        component: Server3
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
        component: Parameter3
      }
    }
  }
}

export class PathItem extends EnforcerComponent<IPathItem3Definition, IPathItem3> implements IPathItem3 {
  [extension: `x${string}`]: any

  constructor (definition: IPathItem3Definition, version?: IVersion) {
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

  static getSchemaDefinition (_data: IPathItemSchemaProcessor): ISchema.ISchemaDefinition<IPathItem3Definition, IPathItem3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<IPathItem3Definition, IPathItem3> = {
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
    result.after = after
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IPathItem3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get $ref (): string | undefined {
    return this.getProperty('$ref')
  }

  set $ref (value: string | undefined) {
    this.setProperty('$ref', value)
  }

  get summary (): string | undefined {
    return this.getProperty('summary')
  }

  set summary (value: string | undefined) {
    this.setProperty('summary', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get get (): IOperation3 | undefined {
    return this.getProperty('get')
  }

  set get (value: IOperation3 | undefined) {
    this.setProperty('get', value)
  }

  get put (): IOperation3 | undefined {
    return this.getProperty('put')
  }

  set put (value: IOperation3 | undefined) {
    this.setProperty('put', value)
  }

  get post (): IOperation3 | undefined {
    return this.getProperty('post')
  }

  set post (value: IOperation3 | undefined) {
    this.setProperty('post', value)
  }

  get delete (): IOperation3 | undefined {
    return this.getProperty('delete')
  }

  set delete (value: IOperation3 | undefined) {
    this.setProperty('delete', value)
  }

  get options (): IOperation3 | undefined {
    return this.getProperty('options')
  }

  set options (value: IOperation3 | undefined) {
    this.setProperty('options', value)
  }

  get head (): IOperation3 | undefined {
    return this.getProperty('head')
  }

  set head (value: IOperation3 | undefined) {
    this.setProperty('head', value)
  }

  get patch (): IOperation3 | undefined {
    return this.getProperty('patch')
  }

  set patch (value: IOperation3 | undefined) {
    this.setProperty('patch', value)
  }

  get trace (): IOperation3 | undefined {
    return this.getProperty('trace')
  }

  set trace (value: IOperation3 | undefined) {
    this.setProperty('trace', value)
  }

  get servers (): IServer3[] | undefined {
    return this.getProperty('servers')
  }

  set servers (value: IServer3[] | undefined) {
    this.setProperty('servers', value)
  }

  get parameters (): IParameter3[] | undefined {
    return this.getProperty('parameters')
  }

  set parameters (value: IParameter3[] | undefined) {
    this.setProperty('parameters', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
