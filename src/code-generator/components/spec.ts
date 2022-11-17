import { IComponentsConfiguration } from './interfaces'

const config: IComponentsConfiguration = {
  Callback: {
    v3: {
      allowsExtensions: true,
      additionalProperties: 'PathItem'
    }
  },
  Components: {
    v3: {
      allowsExtensions: true,
      properties: {
        schemas: 'Schema|Reference{}',
        responses: 'Response|Reference{}',
        parameters: 'Parameter|Reference{}',
        examples: 'Example|Reference{}',
        requestBodies: 'RequestBody|Reference{}',
        headers: 'Header|Reference{}',
        securitySchemes: 'SecurityScheme|Reference{}',
        links: 'Link|Reference{}',
        callbacks: 'Callback|Reference{}'
      }
    }
  },
  Contact: {
    v2: {
      allowsExtensions: true,
      properties: {
        name: 'string',
        url: 'string',
        email: 'string'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        name: 'string',
        url: 'string',
        email: 'string'
      }
    }
  },
  Discriminator: {
    v3: {
      allowsExtensions: false,
      properties: {
        propertyName: 'string!',
        mapping: 'string{}'
      }
    }
  },
  Encoding: {
    v3: {
      allowsExtensions: true,
      properties: {
        contentType: 'string',
        headers: 'Header|Reference{}',
        style: 'string',
        explode: 'boolean',
        allowReserved: 'boolean'
      }
    }
  },
  Example: {
    v2: {
      allowsExtensions: false,
      additionalProperties: 'any'
    },
    v3: {
      allowsExtensions: true,
      properties: {
        summary: 'string',
        description: 'string',
        value: 'any',
        externalValue: 'string'
      }
    }
  },
  'External Documentation': {
    v2: {
      allowsExtensions: true,
      properties: {
        description: 'string',
        url: 'string!'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        description: 'string',
        url: 'string!'
      }
    }
  },
  Header: {
    v2: {
      allowsExtensions: true,
      properties: {
        description: 'string',
        type: "'array'|'boolean'|'integer'|'number'|'string'!",
        format: 'string',
        items: 'Items',
        collectionFormat: "'csv'|'ssv'|'tsv'|'pipes'",
        default: 'any',
        maximum: 'number',
        exclusiveMaximum: 'number',
        minimum: 'number',
        exclusiveMinimum: 'number',
        maxLength: 'number',
        minLength: 'number',
        pattern: 'string',
        maxItems: 'number',
        minItems: 'number',
        uniqueItems: 'boolean',
        enum: 'any[]',
        multipleOf: 'number'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        description: 'string',
        required: 'boolean',
        deprecated: 'boolean',
        allowEmptyValue: 'boolean',
        style: "'simple'",
        explode: 'boolean',
        allowReserved: 'boolean',
        schema: 'Schema|Reference',
        example: 'any',
        examples: 'Example|Reference{}',
        content: 'ContentType{}'
      }
    }
  },
  Info: {
    v2: {
      allowsExtensions: true,
      properties: {
        title: 'string!',
        description: 'string',
        termsOfService: 'string',
        contact: 'Contact',
        license: 'License',
        version: 'string!'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        title: 'string!',
        description: 'string',
        termsOfService: 'string',
        contact: 'Contact',
        license: 'License',
        version: 'string!'
      }
    }
  },
  Items: {
    v2: {
      allowsExtensions: true,
      properties: {
        type: "'array'|'boolean'|'integer'|'number'|'string'!",
        format: 'string',
        items: 'Items',
        collectionFormat: "'csv'|'ssv'|'tsv'|'pipes'",
        default: 'any',
        maximum: 'number',
        exclusiveMaximum: 'boolean',
        minimum: 'number',
        exclusiveMinimum: 'number',
        maxLength: 'number',
        minLength: 'number',
        pattern: 'string',
        maxItems: 'number',
        minItems: 'number',
        uniqueItems: 'boolean',
        enum: 'any[]',
        multipleOf: 'number'
      }
    }
  },
  License: {
    v2: {
      allowsExtensions: true,
      properties: {
        name: 'string!',
        url: 'string'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        name: 'string!',
        url: 'string'
      }
    }
  },
  Link: {
    v3: {
      allowsExtensions: true,
      properties: {
        operationRef: 'string',
        operationId: 'string',
        parameters: 'any{}',
        requestBody: 'any',
        description: 'string',
        server: 'Server'
      }
    }
  },
  'Media Type': {
    v3: {
      allowsExtensions: true,
      properties: {
        schema: 'Schema|Reference',
        example: 'any',
        examples: 'Example|Reference{}',
        encoding: 'Encoding{}'
      }
    }
  },
  'OAuth Flow': {
    v3: {
      allowsExtensions: true,
      properties: {
        authorizationUrl: 'string',
        tokenUrl: 'string',
        refreshUrl: 'string',
        scopes: 'string{}'
      }
    }
  },
  'OAuth Flows': {
    v3: {
      allowsExtensions: true,
      properties: {
        implicit: 'OAuth Flow',
        password: 'OAuth Flow',
        clientCredentials: 'OAuth Flow',
        authorizationCode: 'OAuth Flow'
      }
    }
  },
  OpenAPI: {
    v3: {
      allowsExtensions: true,
      properties: {
        openapi: 'string!',
        info: 'Info!',
        servers: 'Server[]',
        paths: 'Paths!',
        components: 'Components',
        security: 'SecurityRequirement[]',
        tags: 'Tag[]',
        externalDocs: 'ExternalDocumentation'
      }
    }
  },
  Operation: {
    v2: {
      allowsExtensions: true,
      properties: {
        tags: 'string[]',
        summary: 'string',
        description: 'string',
        externalDocs: 'ExternalDocumentation',
        operationId: 'string',
        consumes: 'string[]',
        produces: 'string[]',
        parameters: 'Parameter|Reference[]',
        responses: 'Responses!',
        schemes: 'string[]',
        deprecated: 'boolean',
        security: 'SecurityRequirement[]'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        tags: 'string[]',
        summary: 'string',
        description: 'string',
        externalDocs: 'ExternalDocumentation',
        operationId: 'string',
        parameters: 'Parameter|Reference[]',
        requestBody: 'RequestBody|Reference',
        responses: 'Responses!',
        callbacks: 'Callback|Reference{}',
        deprecated: 'boolean',
        security: 'SecurityRequirement[]',
        servers: 'Server[]'
      }
    }
  },
  Parameter: {
    v2: {
      allowsExtensions: true,
      properties: {
        name: 'string!',
        in: "'body'|'formData'|'header'|'path'|'query'!",
        description: 'string',
        required: 'boolean',
        schema: 'Schema',
        type: "'array'|'boolean'|'file'|'integer'|'number'|'string'",
        format: 'string',
        allowEmptyValue: 'boolean',
        items: 'Items',
        collectionFormat: "'csv'|'ssv'|'tsv'|'pipes'|'multi'",
        default: 'any',
        maximum: 'number',
        exclusiveMaximum: 'boolean',
        minimum: 'number',
        exclusiveMinimum: 'number',
        maxLength: 'number',
        minLength: 'number',
        pattern: 'string',
        maxItems: 'number',
        minItems: 'number',
        uniqueItems: 'boolean',
        enum: 'any[]',
        multipleOf: 'number'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        name: 'string!',
        in: "'cookie'|'header'|'path'|'query'!",
        description: 'string',
        required: 'boolean',
        deprecated: 'boolean',
        allowEmptyValue: 'boolean',
        style: "'deepObject'|'form'|'label'|'matrix'|'pipeDelimited'|'simple'|'spaceDelimited'",
        explode: 'boolean',
        allowReserved: 'boolean',
        schema: 'Schema|Reference',
        example: 'any',
        examples: 'Example|Reference{}',
        content: 'ContentType{}'
      }
    }
  },
  'Path Item': {
    v2: {
      allowsExtensions: true,
      properties: {
        $ref: 'string', // https://github.com/OAI/OpenAPI-Specification/issues/2635
        get: 'Operation',
        put: 'Operation',
        post: 'Operation',
        delete: 'Operation',
        options: 'Operation',
        head: 'Operation',
        patch: 'Operation',
        parameters: 'Parameter|Reference[]'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        $ref: 'string', // https://github.com/OAI/OpenAPI-Specification/issues/2635
        summary: 'string',
        description: 'string',
        get: 'Operation',
        put: 'Operation',
        post: 'Operation',
        delete: 'Operation',
        options: 'Operation',
        head: 'Operation',
        patch: 'Operation',
        trace: 'Operation',
        servers: 'Server[]',
        parameters: 'Parameter|Reference[]'
      }
    }
  },
  Paths: {
    v2: {
      allowsExtensions: true,
      additionalProperties: 'Path',
      // eslint-disable-next-line no-template-curly-in-string
      additionalPropertiesKeyPattern: '`/${string}`'
    },
    v3: {
      allowsExtensions: true,
      additionalProperties: 'Path',
      // eslint-disable-next-line no-template-curly-in-string
      additionalPropertiesKeyPattern: '`/${string}`'
    }
  },
  Reference: {
    v2: {
      allowsExtensions: false,
      properties: {
        $ref: 'string!'
      }
    },
    v3: {
      allowsExtensions: false,
      properties: {
        $ref: 'string!'
      }
    }
  },
  'Request Body': {
    v3: {
      allowsExtensions: true,
      properties: {
        description: 'string',
        content: 'ContentType{}',
        required: 'boolean'
      }
    }
  },
  Response: {
    v2: {
      allowsExtensions: true,
      properties: {
        description: 'string!',
        schema: 'Schema|Reference',
        headers: 'Header{}',
        examples: 'Example'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        description: 'string!',
        headers: 'Header|Reference{}',
        content: 'ContentType{}',
        links: 'Link|Reference{}'
      }
    }
  },
  Responses: {
    v2: {
      allowsExtensions: true,
      additionalProperties: 'Response|Reference',
      additionalPropertiesKeyPattern: 'number',
      properties: {
        default: 'Response|Reference'
      }
    },
    v3: {
      allowsExtensions: true,
      additionalProperties: 'Response|Reference',
      additionalPropertiesKeyPattern: 'number',
      properties: {
        default: 'Response|Reference'
      }
    }
  },
  Schema: {
    v2: {
      allowsExtensions: true,
      properties: {
        format: 'string',
        title: 'string',
        description: 'string',
        default: 'any',
        maximum: 'number',
        exclusiveMaximum: 'number',
        minimum: 'number',
        exclusiveMinimum: 'number',
        maxLength: 'number',
        minLength: 'number',
        pattern: 'string',
        maxItems: 'number',
        minItems: 'number',
        maxProperties: 'number',
        minProperties: 'number',
        uniqueItems: 'boolean',
        enum: 'any[]',
        multipleOf: 'number',
        required: 'string[]',
        type: 'string',
        items: 'Schema',
        allOf: 'Schema|Reference[]',
        properties: 'Schema|Reference{}',
        additionalProperties: 'Schema|Reference',
        discriminator: 'string',
        readOnly: 'boolean',
        xml: 'Xml',
        externalDocs: 'ExternalDocs',
        example: 'any'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        type: 'string',
        allOf: 'Schema|Reference[]',
        oneOf: 'Schema|Reference[]',
        anyOf: 'Schema|Reference[]',
        not: 'Schema|Reference',
        title: 'string',
        maximum: 'number',
        exclusiveMaximum: 'number',
        minimum: 'number',
        exclusiveMinimum: 'number',
        maxLength: 'number',
        minLength: 'number',
        pattern: 'string',
        maxItems: 'number',
        minItems: 'number',
        maxProperties: 'number',
        minProperties: 'number',
        uniqueItems: 'boolean',
        enum: 'any[]',
        multipleOf: 'number',
        required: 'string[]',
        items: 'Schema|Reference',
        properties: 'Schema|Reference{}',
        additionalProperties: 'Schema|Reference',
        description: 'string',
        format: 'string',
        default: 'any',
        nullable: 'boolean',
        discriminator: 'Discriminator',
        readOnly: 'boolean',
        writeOnly: 'boolean',
        xml: 'Xml',
        externalDocs: 'ExternalDocumentation',
        example: 'any',
        deprecated: 'boolean'
      }
    }
  },
  'Security Requirement': {
    v2: {
      allowsExtensions: false,
      additionalProperties: 'string[]'
    },
    v3: {
      allowsExtensions: false,
      additionalProperties: 'string[]'
    }
  },
  'Security Scheme': {
    v2: {
      allowsExtensions: true,
      properties: {
        type: '"basic"|"apiKey"|"oauth2"!',
        description: 'string',
        name: 'string',
        in: '"query"|"header"',
        flow: '"implicit"|"password"|"application"|"accessCode"',
        authorizationUrl: 'string',
        tokenUrl: 'string',
        scopes: 'string{}'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        type: "'apiKey'|'http'|'oauth2'|'openIdConnect'",
        description: 'string',
        name: 'string',
        in: "'query'|'header'|'cookie'",
        scheme: 'string',
        bearerFormat: 'string',
        flows: 'OAuthFlows',
        openIdConnectUrl: 'string'
      }
    }
  },
  Server: {
    v3: {
      allowsExtensions: true,
      properties: {
        url: 'string!',
        description: 'string',
        variables: 'ServerVariable{}'
      }
    }
  },
  'Server Variable': {
    v3: {
      allowsExtensions: true,
      properties: {
        enum: 'string[]',
        default: 'string!',
        description: 'string'
      }
    }
  },
  Swagger: {
    v2: {
      allowsExtensions: true,
      properties: {
        swagger: "'2.0'!",
        info: 'Info!',
        host: 'string',
        basePath: 'string',
        schemes: 'string[]',
        consumes: 'string[]',
        produces: 'string[]',
        paths: 'Paths!',
        definitions: 'Schema{}',
        parameters: 'Parameter{}',
        responses: 'Response{}',
        securityDefinitions: 'SecurityScheme{}',
        security: 'SecurityRequirement[]',
        tags: 'Tag[]',
        externalDocs: 'ExternalDocumentation'
      }
    }
  },
  Tag: {
    v2: {
      allowsExtensions: true,
      properties: {
        name: 'string!',
        description: 'string',
        externalDocs: 'ExternalDocumentation'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        name: 'string!',
        description: 'string',
        externalDocs: 'ExternalDocumentation'
      }
    }
  },
  Xml: {
    v2: {
      allowsExtensions: true,
      properties: {
        name: 'string',
        namespace: 'string',
        prefix: 'string',
        attribute: 'boolean',
        wrapped: 'boolean'
      }
    },
    v3: {
      allowsExtensions: true,
      properties: {
        name: 'string',
        namespace: 'string',
        prefix: 'string',
        attribute: 'boolean',
        wrapped: 'boolean'
      }
    }
  }
}

export default config
