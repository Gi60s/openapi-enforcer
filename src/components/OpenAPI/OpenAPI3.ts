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

/* eslint-disable import/no-duplicates */
import { IComponentSpec, IVersion } from '../IComponent'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Info3, IInfo3 } from '../Info'
import { Server3, IServer3 } from '../Server'
import { Paths3, IPaths3 } from '../Paths'
import { Components3, IComponents3 } from '../Components'
import { SecurityRequirement3, ISecurityRequirement3 } from '../SecurityRequirement'
import { Tag3, ITag3 } from '../Tag'
import { ExternalDocumentation3, IExternalDocumentation3 } from '../ExternalDocumentation'
import { OpenAPI as OpenAPIBase } from './OpenAPI'
import { IOpenAPI3, IOpenAPI3Definition, IOpenAPI3SchemaProcessor, IOpenAPIValidatorsMap3 as IValidatorsMap } from './IOpenAPI'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IOpenAPI3Definition, IOpenAPI3> | null = null

export class OpenAPI extends OpenAPIBase implements IOpenAPI3 {
  public extensions: Record<string, any> = {}
  public openapi!: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
  public info!: IInfo3
  public servers?: IServer3[]
  public paths!: IPaths3
  public components?: IComponents3
  public security?: ISecurityRequirement3[]
  public tags?: ITag3[]
  public externalDocs?: IExternalDocumentation3

  constructor (definition: IOpenAPI3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'OPEN_API3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#openapi-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#openapi-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#openapi-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#openapi-object',
    '3.1.0': true
  }

  static getSchemaDefinition (_data: IOpenAPI3SchemaProcessor): ISDSchemaDefinition<IOpenAPI3Definition, IOpenAPI3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IOpenAPI3Definition, IOpenAPI3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.openapi,
        validators.info,
        validators.servers,
        validators.paths,
        validators.components,
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

  static create (definition?: Partial<IOpenAPI3Definition> | OpenAPI | undefined): OpenAPI {
    if (definition instanceof OpenAPI) {
      return new OpenAPI(Object.assign({}, definition as unknown) as IOpenAPI3Definition)
    } else {
      return new OpenAPI(Object.assign({
        openapi: '3.0.0',
        info: Info3.create(),
        paths: Paths3.create()
      }, definition) as IOpenAPI3Definition)
    }
  }

  static async createAsync (definition?: Partial<IOpenAPI3Definition> | OpenAPI | string | undefined): Promise<OpenAPI> {
    if (definition instanceof OpenAPI) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IOpenAPI3Definition>)
    }
  }

  static createDefinition<T extends Partial<IOpenAPI3Definition>> (definition?: T | undefined): IOpenAPI3Definition & T {
    return Object.assign({
      openapi: '3.0.0',
      info: Info3.create(),
      paths: Paths3.create()
    }, definition) as IOpenAPI3Definition & T
  }

  static validate (definition: IOpenAPI3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IOpenAPI3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

function getValidatorsMap (): IValidatorsMap {
  return {
    openapi: {
      name: 'openapi',
      required: true,
      schema: {
        type: 'string',
        enum: ['3.0.0', '3.0.1', '3.0.2', '3.0.3']
      }
    },
    info: {
      name: 'info',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Info3
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
    paths: {
      name: 'paths',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Paths3
      }
    },
    components: {
      name: 'components',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Components3
      }
    },
    security: {
      name: 'security',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: SecurityRequirement3
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
          component: Tag3
        }
      }
    },
    externalDocs: {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocumentation3
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
