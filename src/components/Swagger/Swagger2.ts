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
import { ISwaggerSchemaProcessor } from '../IInternalTypes'
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

let cachedSchema: ISchema.ISchemaDefinition<ISwagger2Definition, ISwagger2> | null = null

interface IValidatorsMap {
  swagger: ISchema.IProperty<ISchema.IString>
  info: ISchema.IProperty<ISchema.IComponent<IInfo2Definition, IInfo2>>
  host: ISchema.IProperty<ISchema.IString>
  basePath: ISchema.IProperty<ISchema.IString>
  schemes: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  consumes: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  produces: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  paths: ISchema.IProperty<ISchema.IComponent<IPaths2Definition, IPaths2>>
  definitions: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ISchema2Definition, ISchema2>>>
  parameters: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IParameter2Definition, IParameter2>>>
  responses: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IResponse2Definition, IResponse2>>>
  securityDefinitions: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ISecurityScheme2Definition, ISecurityScheme2>>>
  security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISecurityRequirement2Definition, ISecurityRequirement2>>>
  tags: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ITag2Definition, ITag2>>>
  externalDocs: ISchema.IProperty<ISchema.IComponent<IExternalDocumentation2Definition, IExternalDocumentation2>>
}

const validators: IValidatorsMap = {
  swagger: {
    name: 'swagger',
    required: true,
    schema: {
      type: 'string',
      enum: ['2.0']
    }
  },
  info: {
    name: 'info',
    required: true,
    schema: {
      type: 'component',
      allowsRef: false,
      component: Info2
    }
  },
  host: {
    name: 'host',
    schema: {
      type: 'string'
    }
  },
  basePath: {
    name: 'basePath',
    schema: {
      type: 'string'
    }
  },
  schemes: {
    name: 'schemes',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['http', 'https', 'ws', 'wss']
      }
    }
  },
  consumes: {
    name: 'consumes',
    schema: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  produces: {
    name: 'produces',
    schema: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  paths: {
    name: 'paths',
    required: true,
    schema: {
      type: 'component',
      allowsRef: false,
      component: Paths2
    }
  },
  definitions: {
    name: 'definitions',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: Schema2
      }
    }
  },
  parameters: {
    name: 'parameters',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: Parameter2
      }
    }
  },
  responses: {
    name: 'responses',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: Response2
      }
    }
  },
  securityDefinitions: {
    name: 'securityDefinitions',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: false,
        component: SecurityScheme2
      }
    }
  },
  security: {
    name: 'security',
    schema: {
      type: 'array',
      items: {
        type: 'component',
        allowsRef: false,
        component: SecurityRequirement2
      }
    }
  },
  tags: {
    name: 'tags',
    schema: {
      type: 'array',
      items: {
        type: 'component',
        allowsRef: false,
        component: Tag2
      }
    }
  },
  externalDocs: {
    name: 'externalDocs',
    schema: {
      type: 'component',
      allowsRef: false,
      component: ExternalDocumentation2
    }
  }
}

export class Swagger extends EnforcerComponent<ISwagger2Definition, ISwagger2> implements ISwagger2 {
  [extension: `x${string}`]: any

  constructor (definition: ISwagger2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'SWAGGER2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#swagger-object',
    '3.0.0': false,
    '3.0.1': false,
    '3.0.2': false,
    '3.0.3': false
  }

  static getSchemaDefinition (_data: ISwaggerSchemaProcessor): ISchema.ISchemaDefinition<ISwagger2Definition, ISwagger2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<ISwagger2Definition, ISwagger2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.swagger,
        validators.info,
        validators.host,
        validators.basePath,
        validators.schemes,
        validators.consumes,
        validators.produces,
        validators.paths,
        validators.definitions,
        validators.parameters,
        validators.responses,
        validators.securityDefinitions,
        validators.security,
        validators.tags,
        validators.externalDocs
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

  get swagger (): '2.0' {
    return this.getProperty('swagger')
  }

  set swagger (value: '2.0') {
    this.setProperty('swagger', value)
  }

  get info (): IInfo2 {
    return this.getProperty('info')
  }

  set info (value: IInfo2) {
    this.setProperty('info', value)
  }

  get host (): string | undefined {
    return this.getProperty('host')
  }

  set host (value: string | undefined) {
    this.setProperty('host', value)
  }

  get basePath (): string | undefined {
    return this.getProperty('basePath')
  }

  set basePath (value: string | undefined) {
    this.setProperty('basePath', value)
  }

  get schemes (): Array<'http'|'https'|'ws'|'wss'> | undefined {
    return this.getProperty('schemes')
  }

  set schemes (value: Array<'http'|'https'|'ws'|'wss'> | undefined) {
    this.setProperty('schemes', value)
  }

  get consumes (): string[] | undefined {
    return this.getProperty('consumes')
  }

  set consumes (value: string[] | undefined) {
    this.setProperty('consumes', value)
  }

  get produces (): string[] | undefined {
    return this.getProperty('produces')
  }

  set produces (value: string[] | undefined) {
    this.setProperty('produces', value)
  }

  get paths (): IPaths2 {
    return this.getProperty('paths')
  }

  set paths (value: IPaths2) {
    this.setProperty('paths', value)
  }

  get definitions (): Record<string, ISchema2> | undefined {
    return this.getProperty('definitions')
  }

  set definitions (value: Record<string, ISchema2> | undefined) {
    this.setProperty('definitions', value)
  }

  get parameters (): Record<string, IParameter2> | undefined {
    return this.getProperty('parameters')
  }

  set parameters (value: Record<string, IParameter2> | undefined) {
    this.setProperty('parameters', value)
  }

  get responses (): Record<string, IResponse2> | undefined {
    return this.getProperty('responses')
  }

  set responses (value: Record<string, IResponse2> | undefined) {
    this.setProperty('responses', value)
  }

  get securityDefinitions (): Record<string, ISecurityScheme2> | undefined {
    return this.getProperty('securityDefinitions')
  }

  set securityDefinitions (value: Record<string, ISecurityScheme2> | undefined) {
    this.setProperty('securityDefinitions', value)
  }

  get security (): ISecurityRequirement2[] | undefined {
    return this.getProperty('security')
  }

  set security (value: ISecurityRequirement2[] | undefined) {
    this.setProperty('security', value)
  }

  get tags (): ITag2[] | undefined {
    return this.getProperty('tags')
  }

  set tags (value: ITag2[] | undefined) {
    this.setProperty('tags', value)
  }

  get externalDocs (): IExternalDocumentation2 | undefined {
    return this.getProperty('externalDocs')
  }

  set externalDocs (value: IExternalDocumentation2 | undefined) {
    this.setProperty('externalDocs', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
