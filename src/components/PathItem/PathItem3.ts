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
import * as ISchema from '../IComponentSchema'
import { ISchemaProcessor } from '../ISchemaProcessor'
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

// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IPathItem3Definition, IPathItem3> | null = null

export class PathItem extends EnforcerComponent implements IPathItem3 {
  [extension: `x-${string}`]: any
  $ref?: string
  summary?: string
  description?: string
  get?: IOperation3
  put?: IOperation3
  post?: IOperation3
  delete?: IOperation3
  options?: IOperation3
  head?: IOperation3
  patch?: IOperation3
  trace?: IOperation3
  servers?: IServer3[]
  parameters?: IParameter3[]

  constructor (definition: IPathItem3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#path-item-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#path-item-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#path-item-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#path-item-object'
  }

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<IPathItem3Definition, IPathItem3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const $ref: ISchema.IProperty<ISchema.IString> = {
      name: '$ref',
      schema: {
        type: 'string'
      }
    }

    const summary: ISchema.IProperty<ISchema.IString> = {
      name: 'summary',
      schema: {
        type: 'string'
      }
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const get: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>> = {
      name: 'get',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3
      }
    }

    const put: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>> = {
      name: 'put',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3
      }
    }

    const post: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>> = {
      name: 'post',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3
      }
    }

    const delete: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>> = {
      name: 'delete',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3
      }
    }

    const options: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>> = {
      name: 'options',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3
      }
    }

    const head: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>> = {
      name: 'head',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3
      }
    }

    const patch: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>> = {
      name: 'patch',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3
      }
    }

    const trace: ISchema.IProperty<ISchema.IComponent<IOperation3Definition, IOperation3>> = {
      name: 'trace',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation3
      }
    }

    const servers: ISchema.IProperty<ISchema.IComponent<IServer3Definition, IServer3>> = {
      name: 'servers',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Server3
      }
    }

    const parameters: ISchema.IProperty<ISchema.IComponent<IParameter3Definition, IParameter3>> = {
      name: 'parameters',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Parameter3
      }
    }

    const schema: ISchema.IDefinition<IPathItem3Definition, IPathItem3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        $ref,
        summary,
        description,
        get,
        put,
        post,
        delete,
        options,
        head,
        patch,
        trace,
        servers,
        parameters
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = schema
    return schema
  }

  static validate (definition: IPathItem3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
