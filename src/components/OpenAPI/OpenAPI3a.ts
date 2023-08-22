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
import { Info3a, IInfo3a } from '../Info'
import { Server3a, IServer3a } from '../Server'
import { Paths3a, IPaths3a } from '../Paths'
import { Components3a, IComponents3a } from '../Components'
import { SecurityRequirement3a, ISecurityRequirement3a } from '../SecurityRequirement'
import { Tag3a, ITag3a } from '../Tag'
import { ExternalDocumentation3a, IExternalDocumentation3a } from '../ExternalDocumentation'
import { OpenAPI as OpenAPIBase } from './OpenAPI'
import { IOpenAPI3a, IOpenAPI3aDefinition, IOpenAPI3aSchemaProcessor, IOpenAPIValidatorsMap3a as IValidatorsMap } from './IOpenAPI'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IOpenAPI3aDefinition, IOpenAPI3a> | null = null

export class OpenAPI extends OpenAPIBase implements IOpenAPI3a {
  public extensions: Record<string, any> = {}
  public openapi!: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
  public info!: IInfo3a
  public servers?: IServer3a[]
  public paths!: IPaths3a
  public components?: IComponents3a
  public security?: ISecurityRequirement3a[]
  public tags?: ITag3a[]
  public externalDocs?: IExternalDocumentation3a

  constructor (definition: IOpenAPI3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'openAPI'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#openapi-object'
  }

  static getSchemaDefinition (_data: IOpenAPI3aSchemaProcessor): ISDSchemaDefinition<IOpenAPI3aDefinition, IOpenAPI3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IOpenAPI3aDefinition, IOpenAPI3a> = {
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
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IOpenAPI3aDefinition> | OpenAPI | undefined): OpenAPI {
    if (definition instanceof OpenAPI) {
      return new OpenAPI(Object.assign({}, definition as unknown) as IOpenAPI3aDefinition)
    } else {
      return new OpenAPI(Object.assign({
        openapi: '3.0.0',
        info: Info3a.create(),
        paths: Paths3a.create()
      }, definition) as IOpenAPI3aDefinition)
    }
  }

  static async createAsync (definition?: Partial<IOpenAPI3aDefinition> | OpenAPI | string | undefined): Promise<OpenAPI> {
    if (definition instanceof OpenAPI) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IOpenAPI3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IOpenAPI3aDefinition>> (definition?: T | undefined): IOpenAPI3aDefinition & T {
    return Object.assign({
      openapi: '3.0.0',
      info: Info3a.create(),
      paths: Paths3a.create()
    }, definition) as IOpenAPI3aDefinition & T
  }

  static validate (definition: IOpenAPI3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IOpenAPI3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
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
        component: Info3a
      }
    },
    servers: {
      name: 'servers',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: Server3a
        }
      }
    },
    paths: {
      name: 'paths',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Paths3a
      }
    },
    components: {
      name: 'components',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Components3a
      }
    },
    security: {
      name: 'security',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: SecurityRequirement3a
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
          component: Tag3a
        }
      }
    },
    externalDocs: {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocumentation3a
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
