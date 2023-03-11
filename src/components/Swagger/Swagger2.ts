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
import { EnforcerComponent, SetProperty, GetProperty } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.ISwagger2Definition, I.ISwagger2> | null = null

interface IValidatorsMap {
  swagger: ISchema.IProperty<ISchema.IString>
  info: ISchema.IProperty<ISchema.IComponent<I.IInfo2Definition, I.IInfo2>>
  host: ISchema.IProperty<ISchema.IString>
  basePath: ISchema.IProperty<ISchema.IString>
  schemes: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  consumes: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  produces: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  paths: ISchema.IProperty<ISchema.IComponent<I.IPaths2Definition, I.IPaths2>>
  definitions: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.ISchema2Definition, I.ISchema2>>>
  parameters: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IParameter2Definition, I.IParameter2>>>
  responses: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.IResponse2Definition, I.IResponse2>>>
  securityDefinitions: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.ISecurityScheme2Definition, I.ISecurityScheme2>>>
  security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ISecurityRequirement2Definition, I.ISecurityRequirement2>>>
  tags: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ITag2Definition, I.ITag2>>>
  externalDocs: ISchema.IProperty<ISchema.IComponent<I.IExternalDocumentation2Definition, I.IExternalDocumentation2>>
}

export class Swagger extends EnforcerComponent<I.ISwagger2Definition> implements I.ISwagger2 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.ISwagger2Definition, version?: IVersion) {
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

  static getSchemaDefinition (_data: I.ISwaggerSchemaProcessor): ISchema.ISchemaDefinition<I.ISwagger2Definition, I.ISwagger2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.ISwagger2Definition, I.ISwagger2> = {
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

  static create (definition?: Partial<I.ISwagger2Definition> | Swagger | undefined): Swagger {
    if (definition instanceof Swagger) {
      return new Swagger(Object.assign({}, definition))
    } else {
      return new Swagger(Object.assign({
        swagger: '2.0',
        info: I.Info2.create(),
        paths: I.Paths2.create()
      }, definition) as I.ISwagger2Definition)
    }
  }

  static async createAsync (definition?: Partial<I.ISwagger2Definition> | Swagger | string | undefined): Promise<Swagger> {
    if (definition instanceof Swagger) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.ISwagger2Definition>)
    }
  }

  static createDefinition<T extends Partial<I.ISwagger2Definition>> (definition?: T | undefined): I.ISwagger2Definition & T {
    return Object.assign({
      swagger: '2.0',
      info: I.Info2.create(),
      paths: I.Paths2.create()
    }, definition) as I.ISwagger2Definition & T
  }

  static validate (definition: I.ISwagger2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.ISwagger2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get swagger (): '2.0' {
    return this[GetProperty]('swagger')
  }

  set swagger (value: '2.0') {
    this[SetProperty]('swagger', value)
  }

  get info (): I.IInfo2 {
    return this[GetProperty]('info')
  }

  set info (value: I.IInfo2) {
    this[SetProperty]('info', value)
  }

  get host (): string | undefined {
    return this[GetProperty]('host')
  }

  set host (value: string | undefined) {
    this[SetProperty]('host', value)
  }

  get basePath (): string | undefined {
    return this[GetProperty]('basePath')
  }

  set basePath (value: string | undefined) {
    this[SetProperty]('basePath', value)
  }

  get schemes (): Array<'http'|'https'|'ws'|'wss'> | undefined {
    return this[GetProperty]('schemes')
  }

  set schemes (value: Array<'http'|'https'|'ws'|'wss'> | undefined) {
    this[SetProperty]('schemes', value)
  }

  get consumes (): string[] | undefined {
    return this[GetProperty]('consumes')
  }

  set consumes (value: string[] | undefined) {
    this[SetProperty]('consumes', value)
  }

  get produces (): string[] | undefined {
    return this[GetProperty]('produces')
  }

  set produces (value: string[] | undefined) {
    this[SetProperty]('produces', value)
  }

  get paths (): I.IPaths2 {
    return this[GetProperty]('paths')
  }

  set paths (value: I.IPaths2) {
    this[SetProperty]('paths', value)
  }

  get definitions (): Record<string, I.ISchema2> | undefined {
    return this[GetProperty]('definitions')
  }

  set definitions (value: Record<string, I.ISchema2> | undefined) {
    this[SetProperty]('definitions', value)
  }

  get parameters (): Record<string, I.IParameter2> | undefined {
    return this[GetProperty]('parameters')
  }

  set parameters (value: Record<string, I.IParameter2> | undefined) {
    this[SetProperty]('parameters', value)
  }

  get responses (): Record<string, I.IResponse2> | undefined {
    return this[GetProperty]('responses')
  }

  set responses (value: Record<string, I.IResponse2> | undefined) {
    this[SetProperty]('responses', value)
  }

  get securityDefinitions (): Record<string, I.ISecurityScheme2> | undefined {
    return this[GetProperty]('securityDefinitions')
  }

  set securityDefinitions (value: Record<string, I.ISecurityScheme2> | undefined) {
    this[SetProperty]('securityDefinitions', value)
  }

  get security (): I.ISecurityRequirement2[] | undefined {
    return this[GetProperty]('security')
  }

  set security (value: I.ISecurityRequirement2[] | undefined) {
    this[SetProperty]('security', value)
  }

  get tags (): I.ITag2[] | undefined {
    return this[GetProperty]('tags')
  }

  set tags (value: I.ITag2[] | undefined) {
    this[SetProperty]('tags', value)
  }

  get externalDocs (): I.IExternalDocumentation2 | undefined {
    return this[GetProperty]('externalDocs')
  }

  set externalDocs (value: I.IExternalDocumentation2 | undefined) {
    this[SetProperty]('externalDocs', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

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
        component: I.Info2
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
        component: I.Paths2
      }
    },
    definitions: {
      name: 'definitions',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: I.Schema2
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
          component: I.Parameter2
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
          component: I.Response2
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
          component: I.SecurityScheme2
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
          component: I.SecurityRequirement2
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
          component: I.Tag2
        }
      }
    },
    externalDocs: {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.ExternalDocumentation2
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
