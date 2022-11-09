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
  IOperation2,
  IOperation2Definition,
  IParameter2,
  IParameter2Definition,
  IPathItem2,
  IPathItem2Definition,
  Operation2,
  Parameter2
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IPathItem2Definition, IPathItem2> | null = null

export class PathItem extends EnforcerComponent implements IPathItem2 {
  [extension: `x-${string}`]: any
  $ref?: string
  get?: IOperation2
  put?: IOperation2
  post?: IOperation2
  delete?: IOperation2
  options?: IOperation2
  head?: IOperation2
  patch?: IOperation2
  parameters?: IParameter2[]

  constructor (definition: IPathItem2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#path-item-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchema (_data: ISchemaProcessor): ISchema.IDefinition<IPathItem2Definition, IPathItem2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const $ref: ISchema.IProperty<ISchema.IString> = {
      name: '$ref',
      schema: {
        type: 'string'
      }
    }

    const get: ISchema.IProperty<ISchema.IComponent<IOperation2Definition, IOperation2>> = {
      name: 'get',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    }

    const put: ISchema.IProperty<ISchema.IComponent<IOperation2Definition, IOperation2>> = {
      name: 'put',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    }

    const post: ISchema.IProperty<ISchema.IComponent<IOperation2Definition, IOperation2>> = {
      name: 'post',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    }

    const _delete: ISchema.IProperty<ISchema.IComponent<IOperation2Definition, IOperation2>> = {
      name: 'delete',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    }

    const options: ISchema.IProperty<ISchema.IComponent<IOperation2Definition, IOperation2>> = {
      name: 'options',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    }

    const head: ISchema.IProperty<ISchema.IComponent<IOperation2Definition, IOperation2>> = {
      name: 'head',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    }

    const patch: ISchema.IProperty<ISchema.IComponent<IOperation2Definition, IOperation2>> = {
      name: 'patch',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Operation2
      }
    }

    const parameters: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<IParameter2Definition, IParameter2>>> = {
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

    const result: ISchema.IDefinition<IPathItem2Definition, IPathItem2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        $ref,
        get,
        put,
        post,
        _delete,
        options,
        head,
        patch,
        parameters
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IPathItem2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
