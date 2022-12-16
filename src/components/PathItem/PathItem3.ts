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
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
import { after } from './common'
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

export class PathItem extends EnforcerComponent<I.IPathItem3Definition> implements I.IPathItem3 {
  [extension: `x${string}`]: any

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
    result.after = after
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: I.IPathItem3Definition, version?: IVersion): ExceptionStore {
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

  get get (): I.IOperation3 | undefined {
    return this.getProperty('get')
  }

  set get (value: I.IOperation3 | undefined) {
    this.setProperty('get', value)
  }

  get put (): I.IOperation3 | undefined {
    return this.getProperty('put')
  }

  set put (value: I.IOperation3 | undefined) {
    this.setProperty('put', value)
  }

  get post (): I.IOperation3 | undefined {
    return this.getProperty('post')
  }

  set post (value: I.IOperation3 | undefined) {
    this.setProperty('post', value)
  }

  get delete (): I.IOperation3 | undefined {
    return this.getProperty('delete')
  }

  set delete (value: I.IOperation3 | undefined) {
    this.setProperty('delete', value)
  }

  get options (): I.IOperation3 | undefined {
    return this.getProperty('options')
  }

  set options (value: I.IOperation3 | undefined) {
    this.setProperty('options', value)
  }

  get head (): I.IOperation3 | undefined {
    return this.getProperty('head')
  }

  set head (value: I.IOperation3 | undefined) {
    this.setProperty('head', value)
  }

  get patch (): I.IOperation3 | undefined {
    return this.getProperty('patch')
  }

  set patch (value: I.IOperation3 | undefined) {
    this.setProperty('patch', value)
  }

  get trace (): I.IOperation3 | undefined {
    return this.getProperty('trace')
  }

  set trace (value: I.IOperation3 | undefined) {
    this.setProperty('trace', value)
  }

  get servers (): I.IServer3[] | undefined {
    return this.getProperty('servers')
  }

  set servers (value: I.IServer3[] | undefined) {
    this.setProperty('servers', value)
  }

  get parameters (): I.IParameter3[] | undefined {
    return this.getProperty('parameters')
  }

  set parameters (value: I.IParameter3[] | undefined) {
    this.setProperty('parameters', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
