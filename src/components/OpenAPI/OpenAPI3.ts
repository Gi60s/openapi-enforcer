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
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IOpenAPI3Definition, I.IOpenAPI3> | null = null

interface IValidatorsMap {
  openapi: ISchema.IProperty<ISchema.IString>
  info: ISchema.IProperty<ISchema.IComponent<I.IInfo3Definition, I.IInfo3>>
  servers: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.IServer3Definition, I.IServer3>>>
  paths: ISchema.IProperty<ISchema.IComponent<I.IPaths3Definition, I.IPaths3>>
  components: ISchema.IProperty<ISchema.IComponent<I.IComponents3Definition, I.IComponents3>>
  security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ISecurityRequirement3Definition, I.ISecurityRequirement3>>>
  tags: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ITag3Definition, I.ITag3>>>
  externalDocs: ISchema.IProperty<ISchema.IComponent<I.IExternalDocumentation3Definition, I.IExternalDocumentation3>>
}

export class OpenAPI extends EnforcerComponent<I.IOpenAPI3Definition> implements I.IOpenAPI3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IOpenAPI3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'OPEN_API3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#openapi-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#openapi-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#openapi-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#openapi-object'
  }

  static getSchemaDefinition (_data: I.IOpenAPISchemaProcessor): ISchema.ISchemaDefinition<I.IOpenAPI3Definition, I.IOpenAPI3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IOpenAPI3Definition, I.IOpenAPI3> = {
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

  static create (definition?: Partial<I.IOpenAPI3Definition> | OpenAPI | undefined): OpenAPI {
    if (definition instanceof OpenAPI) {
      return new OpenAPI(Object.assign({}, definition))
    } else {
      return new OpenAPI(Object.assign({
        openapi: '3.0.0',
        info: I.Info3.create(),
        paths: I.Paths3.create()
      }, definition) as I.IOpenAPI3Definition)
    }
  }

  static createDefinition<T extends Partial<I.IOpenAPI3Definition>> (definition?: T | undefined): I.IOpenAPI3Definition & T {
    return Object.assign({
      openapi: '3.0.0',
      info: I.Info3.create(),
      paths: I.Paths3.create()
    }, definition) as I.IOpenAPI3Definition & T
  }

  static validate (definition: I.IOpenAPI3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get openapi (): '3.0.0'|'3.0.1'|'3.0.2'|'3.0.3' {
    return this[GetProperty]('openapi')
  }

  set openapi (value: '3.0.0'|'3.0.1'|'3.0.2'|'3.0.3') {
    this[SetProperty]('openapi', value)
  }

  get info (): I.IInfo3 {
    return this[GetProperty]('info')
  }

  set info (value: I.IInfo3) {
    this[SetProperty]('info', value)
  }

  get servers (): I.IServer3[] | undefined {
    return this[GetProperty]('servers')
  }

  set servers (value: I.IServer3[] | undefined) {
    this[SetProperty]('servers', value)
  }

  get paths (): I.IPaths3 {
    return this[GetProperty]('paths')
  }

  set paths (value: I.IPaths3) {
    this[SetProperty]('paths', value)
  }

  get components (): I.IComponents3 | undefined {
    return this[GetProperty]('components')
  }

  set components (value: I.IComponents3 | undefined) {
    this[SetProperty]('components', value)
  }

  get security (): I.ISecurityRequirement3[] | undefined {
    return this[GetProperty]('security')
  }

  set security (value: I.ISecurityRequirement3[] | undefined) {
    this[SetProperty]('security', value)
  }

  get tags (): I.ITag3[] | undefined {
    return this[GetProperty]('tags')
  }

  set tags (value: I.ITag3[] | undefined) {
    this[SetProperty]('tags', value)
  }

  get externalDocs (): I.IExternalDocumentation3 | undefined {
    return this[GetProperty]('externalDocs')
  }

  set externalDocs (value: I.IExternalDocumentation3 | undefined) {
    this[SetProperty]('externalDocs', value)
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

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
        component: I.Info3
      }
    },
    servers: {
      name: 'servers',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: I.Server3
        }
      }
    },
    paths: {
      name: 'paths',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Paths3
      }
    },
    components: {
      name: 'components',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Components3
      }
    },
    security: {
      name: 'security',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: I.SecurityRequirement3
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
          component: I.Tag3
        }
      }
    },
    externalDocs: {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.ExternalDocumentation3
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
