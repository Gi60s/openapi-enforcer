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

let cachedSchema: ISchema.ISchemaDefinition<IOpenAPI3Definition, IOpenAPI3> | null = null

interface IValidatorsMap {
  openapi: ISchema.IProperty<ISchema.IString>
  info: ISchema.IProperty<ISchema.IComponent<IInfo3Definition, IInfo3>>
  servers: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<IServer3Definition, IServer3>>>
  paths: ISchema.IProperty<ISchema.IComponent<IPaths3Definition, IPaths3>>
  components: ISchema.IProperty<ISchema.IComponent<IComponents3Definition, IComponents3>>
  security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISecurityRequirement3Definition, ISecurityRequirement3>>>
  tags: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ITag3Definition, ITag3>>>
  externalDocs: ISchema.IProperty<ISchema.IComponent<IExternalDocumentation3Definition, IExternalDocumentation3>>
}

const validators: IValidatorsMap = {
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

export class OpenAPI extends EnforcerComponent<IOpenAPI3Definition, IOpenAPI3> implements IOpenAPI3 {
  [extension: `x${string}`]: any

  constructor (definition: IOpenAPI3Definition, version?: IVersion) {
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

  static getSchemaDefinition (_data: IOpenAPISchemaProcessor): ISchema.ISchemaDefinition<IOpenAPI3Definition, IOpenAPI3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<IOpenAPI3Definition, IOpenAPI3> = {
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

    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IOpenAPI3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get openapi (): '3.0.0'|'3.0.1'|'3.0.2'|'3.0.3' {
    return this.getProperty('openapi')
  }

  set openapi (value: '3.0.0'|'3.0.1'|'3.0.2'|'3.0.3') {
    this.setProperty('openapi', value)
  }

  get info (): IInfo3 {
    return this.getProperty('info')
  }

  set info (value: IInfo3) {
    this.setProperty('info', value)
  }

  get servers (): IServer3[] | undefined {
    return this.getProperty('servers')
  }

  set servers (value: IServer3[] | undefined) {
    this.setProperty('servers', value)
  }

  get paths (): IPaths3 {
    return this.getProperty('paths')
  }

  set paths (value: IPaths3) {
    this.setProperty('paths', value)
  }

  get components (): IComponents3 | undefined {
    return this.getProperty('components')
  }

  set components (value: IComponents3 | undefined) {
    this.setProperty('components', value)
  }

  get security (): ISecurityRequirement3[] | undefined {
    return this.getProperty('security')
  }

  set security (value: ISecurityRequirement3[] | undefined) {
    this.setProperty('security', value)
  }

  get tags (): ITag3[] | undefined {
    return this.getProperty('tags')
  }

  set tags (value: ITag3[] | undefined) {
    this.setProperty('tags', value)
  }

  get externalDocs (): IExternalDocumentation3 | undefined {
    return this.getProperty('externalDocs')
  }

  set externalDocs (value: IExternalDocumentation3 | undefined) {
    this.setProperty('externalDocs', value)
  }

  // <!# Custom Content Begin: BODY #!>

  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
