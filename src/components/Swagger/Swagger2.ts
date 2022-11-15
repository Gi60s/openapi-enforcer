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
  ExternalDocumentation2,
  IExternalDocumentation2,
  IExternalDocumentation2Definition,
  IInfo2,
  IInfo2Definition,
  IParameter2,
  IParameter2Definition,
  IPaths2,
  IPaths2Definition,
  IResponse2,
  IResponse2Definition,
  ISchema2,
  ISchema2Definition,
  ISecurityRequirement2,
  ISecurityRequirement2Definition,
  ISecurityScheme2,
  ISecurityScheme2Definition,
  ISwagger2,
  ISwagger2Definition,
  ITag2,
  ITag2Definition,
  Info2,
  Parameter2,
  Paths2,
  Response2,
  Schema2,
  SecurityRequirement2,
  SecurityScheme2,
  Tag2
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<ISwagger2Definition, ISwagger2> | null = null

export class Swagger extends EnforcerComponent implements ISwagger2 {
  [extension: `x-${string}`]: any
  swagger!: '2.0'
  info!: IInfo2
  host?: string
  basePath?: string
  schemes?: Array<'http'|'https'|'ws'|'wss'>
  consumes?: string[]
  produces?: string[]
  paths!: IPaths2
  definitions?: Record<string, ISchema2>
  parameters?: Record<string, IParameter2>
  responses?: Record<string, IResponse2>
  securityDefinitions?: Record<string, ISecurityScheme2>
  security?: ISecurityRequirement2[]
  tags?: ITag2[]
  externalDocs?: IExternalDocumentation2

  constructor (definition: ISwagger2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#swagger-object',
    '3.0.0': false,
    '3.0.1': false,
    '3.0.2': false,
    '3.0.3': false
  }

  static getSchema (_data: ISchemaProcessor): ISchema.IDefinition<ISwagger2Definition, ISwagger2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const swagger: ISchema.IProperty<ISchema.IString> = {
      name: 'swagger',
      required: true,
      schema: {
        type: 'string',
        enum: ['2.0']
      }
    }

    const info: ISchema.IProperty<ISchema.IComponent<IInfo2Definition, IInfo2>> = {
      name: 'info',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Info2
      }
    }

    const host: ISchema.IProperty<ISchema.IString> = {
      name: 'host',
      schema: {
        type: 'string'
      }
    }

    const basePath: ISchema.IProperty<ISchema.IString> = {
      name: 'basePath',
      schema: {
        type: 'string'
      }
    }

    const schemes: ISchema.IProperty<ISchema.IArray<ISchema.IString>> = {
      name: 'schemes',
      schema: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['http', 'https', 'ws', 'wss']
        }
      }
    }

    const consumes: ISchema.IProperty<ISchema.IArray<ISchema.IString>> = {
      name: 'consumes',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }

    const produces: ISchema.IProperty<ISchema.IArray<ISchema.IString>> = {
      name: 'produces',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }

    const paths: ISchema.IProperty<ISchema.IComponent<IPaths2Definition, IPaths2>> = {
      name: 'paths',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Paths2
      }
    }

    const definitions: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ISchema2Definition, ISchema2>>> = {
      name: 'definitions',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: Schema2
        }
      }
    }

    const parameters: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IParameter2Definition, IParameter2>>> = {
      name: 'parameters',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: Parameter2
        }
      }
    }

    const responses: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IResponse2Definition, IResponse2>>> = {
      name: 'responses',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: Response2
        }
      }
    }

    const securityDefinitions: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ISecurityScheme2Definition, ISecurityScheme2>>> = {
      name: 'securityDefinitions',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: SecurityScheme2
        }
      }
    }

    const security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISecurityRequirement2Definition, ISecurityRequirement2>>> = {
      name: 'security',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: SecurityRequirement2
        }
      }
    }

    const tags: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ITag2Definition, ITag2>>> = {
      name: 'tags',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: Tag2
        }
      }
    }

    const externalDocs: ISchema.IProperty<ISchema.IComponent<IExternalDocumentation2Definition, IExternalDocumentation2>> = {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocumentation2
      }
    }

    const result: ISchema.IDefinition<ISwagger2Definition, ISwagger2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        swagger,
        info,
        host,
        basePath,
        schemes,
        consumes,
        produces,
        paths,
        definitions,
        parameters,
        responses,
        securityDefinitions,
        security,
        tags,
        externalDocs
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: ISwagger2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
