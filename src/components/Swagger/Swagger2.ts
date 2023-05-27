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
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Info2, IInfo2, IInfo2Definition } from '../Info'
import { Paths2, IPaths2, IPaths2Definition } from '../Paths'
import { ExternalDocumentation2, IExternalDocumentation2, IExternalDocumentation2Definition } from '../ExternalDocumentation'
import { Swagger as SwaggerBase } from './Swagger'
import { ISwagger2, ISwagger2Definition, ISwagger2SchemaProcessor, ISwaggerValidatorsMap2 as IValidatorsMap } from './ISwagger'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<ISwagger2Definition, ISwagger2> | null = null

export class Swagger extends SwaggerBase implements ISwagger2 {
  public extensions: Record<string, any> = {}
  public swagger!: '2.0'
  public info!: IInfo2
  public host?: string
  public basePath?: string
  public schemes?: Array<'http' | 'https' | 'ws' | 'wss'>
  public consumes?: string[]
  public produces?: string[]
  public paths!: IPaths2
  public definitions?: Record<string, ISchema2>
  public parameters?: Record<string, IParameter2>
  public responses?: Record<string, IResponse2>
  public securityDefinitions?: Record<string, ISecurityScheme2>
  public security?: ISecurityRequirement2[]
  public tags?: ITag2[]
  public externalDocs?: IExternalDocumentation2

  constructor (definition: ISwagger2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SWAGGER2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#swagger-object',
    '3.0.0': false,
    '3.0.1': false,
    '3.0.2': false,
    '3.0.3': false,
    '3.1.0': false
  }

  static getSchemaDefinition (_data: ISwagger2SchemaProcessor): ISDSchemaDefinition<ISwagger2Definition, ISwagger2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<ISwagger2Definition, ISwagger2> = {
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
    result.build = function (processor) {
      processor.store.documentRoot = processor
    }

    result.validate = function (processor) {
      processor.store.documentRoot = processor
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<ISwagger2Definition> | Swagger | undefined): Swagger {
    if (definition instanceof Swagger) {
      return new Swagger(Object.assign({}, definition as unknown) as ISwagger2Definition)
    } else {
      return new Swagger(Object.assign({
        swagger: '2.0',
        info: Info2.create(),
        paths: Paths2.create()
      }, definition) as ISwagger2Definition)
    }
  }

  static async createAsync (definition?: Partial<ISwagger2Definition> | Swagger | string | undefined): Promise<Swagger> {
    if (definition instanceof Swagger) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<ISwagger2Definition>)
    }
  }

  static createDefinition<T extends Partial<ISwagger2Definition>> (definition?: T | undefined): ISwagger2Definition & T {
    return Object.assign({
      swagger: '2.0',
      info: Info2.create(),
      paths: Paths2.create()
    }, definition) as ISwagger2Definition & T
  }

  static validate (definition: ISwagger2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: ISwagger2Definition | string, version?: IVersion): Promise<ExceptionStore> {
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
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
