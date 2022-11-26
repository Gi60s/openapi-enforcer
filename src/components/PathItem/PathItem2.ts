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
import { after } from './common'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IPathItem2Definition, IPathItem2> | null = null

export class PathItem extends EnforcerComponent<IPathItem2Definition, IPathItem2> implements IPathItem2 {
  [extension: `x${string}`]: any

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

  static getSchemaDefinition (_data: IPathItemSchemaProcessor): ISchema.ISchemaDefinition<IPathItem2Definition, IPathItem2> {
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

    const result: ISchema.ISchemaDefinition<IPathItem2Definition, IPathItem2> = {
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
    result.after = after
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IPathItem2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get $ref (): string | undefined {
    return this.getProperty('$ref')
  }

  set $ref (value: string | undefined) {
    this.setProperty('$ref', value)
  }

  get get (): IOperation2 | undefined {
    return this.getProperty('get')
  }

  set get (value: IOperation2 | undefined) {
    this.setProperty('get', value)
  }

  get put (): IOperation2 | undefined {
    return this.getProperty('put')
  }

  set put (value: IOperation2 | undefined) {
    this.setProperty('put', value)
  }

  get post (): IOperation2 | undefined {
    return this.getProperty('post')
  }

  set post (value: IOperation2 | undefined) {
    this.setProperty('post', value)
  }

  get delete (): IOperation2 | undefined {
    return this.getProperty('delete')
  }

  set delete (value: IOperation2 | undefined) {
    this.setProperty('delete', value)
  }

  get options (): IOperation2 | undefined {
    return this.getProperty('options')
  }

  set options (value: IOperation2 | undefined) {
    this.setProperty('options', value)
  }

  get head (): IOperation2 | undefined {
    return this.getProperty('head')
  }

  set head (value: IOperation2 | undefined) {
    this.setProperty('head', value)
  }

  get patch (): IOperation2 | undefined {
    return this.getProperty('patch')
  }

  set patch (value: IOperation2 | undefined) {
    this.setProperty('patch', value)
  }

  get parameters (): IParameter2[] | undefined {
    return this.getProperty('parameters')
  }

  set parameters (value: IParameter2[] | undefined) {
    this.setProperty('parameters', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
