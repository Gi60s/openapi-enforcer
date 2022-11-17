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
import { IOpenAPISchemaProcessor } from '../IInternalTypes'
import {
  Components3,
  ExternalDocumentation3,
  IComponents3,
  IComponents3Definition,
  IExternalDocumentation3,
  IExternalDocumentation3Definition,
  IInfo3,
  IInfo3Definition,
  IOpenAPI3,
  IOpenAPI3Definition,
  IPaths3,
  IPaths3Definition,
  ISecurityRequirement3,
  ISecurityRequirement3Definition,
  IServer3,
  IServer3Definition,
  ITag3,
  ITag3Definition,
  Info3,
  Paths3,
  SecurityRequirement3,
  Server3,
  Tag3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IOpenAPI3Definition, IOpenAPI3> | null = null

export class OpenAPI extends EnforcerComponent implements IOpenAPI3 {
  [extension: `x-${string}`]: any
  openapi!: '3.0.0'|'3.0.1'|'3.0.2'|'3.0.3'
  info!: IInfo3
  servers?: IServer3[]
  paths!: IPaths3
  components?: IComponents3
  security?: ISecurityRequirement3[]
  tags?: ITag3[]
  externalDocs?: IExternalDocumentation3

  constructor (definition: IOpenAPI3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#openapi-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#openapi-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#openapi-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#openapi-object'
  }

  static getSchema (_data: IOpenAPISchemaProcessor): ISchema.IDefinition<IOpenAPI3Definition, IOpenAPI3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const openapi: ISchema.IProperty<ISchema.IString> = {
      name: 'openapi',
      required: true,
      schema: {
        type: 'string',
        enum: ['3.0.0', '3.0.1', '3.0.2', '3.0.3']
      }
    }

    const info: ISchema.IProperty<ISchema.IComponent<IInfo3Definition, IInfo3>> = {
      name: 'info',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Info3
      }
    }

    const servers: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<IServer3Definition, IServer3>>> = {
      name: 'servers',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: Server3
        }
      }
    }

    const paths: ISchema.IProperty<ISchema.IComponent<IPaths3Definition, IPaths3>> = {
      name: 'paths',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Paths3
      }
    }

    const components: ISchema.IProperty<ISchema.IComponent<IComponents3Definition, IComponents3>> = {
      name: 'components',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Components3
      }
    }

    const security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISecurityRequirement3Definition, ISecurityRequirement3>>> = {
      name: 'security',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: SecurityRequirement3
        }
      }
    }

    const tags: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ITag3Definition, ITag3>>> = {
      name: 'tags',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: Tag3
        }
      }
    }

    const externalDocs: ISchema.IProperty<ISchema.IComponent<IExternalDocumentation3Definition, IExternalDocumentation3>> = {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocumentation3
      }
    }

    const result: ISchema.IDefinition<IOpenAPI3Definition, IOpenAPI3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        openapi,
        info,
        servers,
        paths,
        components,
        security,
        tags,
        externalDocs
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>

    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IOpenAPI3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
