import { ExceptionMessageDataInput, LocationInput, Level } from './types'
import { smart } from '../util'

export interface Context {
  definition: any
  locations: LocationInput[]
  reference?: string
}

export interface MessageTemplate {
  id: string
  code: string
  alternateLevels: Level[]
  level: Level
  message: string
}

export const list: MessageTemplate[] = [
  {
    id: '$REF_NOT_ALLOWED',
    code: 'RENOAL',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Reference not allowed here.'
  },
  {
    id: 'DEFAULT_REQUIRED_CONFLICT',
    code: 'DERECO',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Setting a "default" value and setting "required" to true means the "default" value will never be used.'
  },
  {
    id: 'DEFAULT_VALUE_DOES_NOT_MATCH_SCHEMA',
    code: 'DVDNMS',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Default value ${defaultValue} does not match its associated schema.'
  },
  {
    id: 'ENCODING_NAME_NOT_MATCHED',
    code: 'ENNANM',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Encoding name "${encodingName}" must match a property name in the media type\'s schema'
  },
  {
    id: 'ENCODING_HEADER_CONTENT_TYPE',
    code: 'ENHECT',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Encoding headers should not include Content-Type. That is already part of the Encoding definition under the "contentType" property.'
  },
  {
    id: 'ENCODING_HEADERS_IGNORED',
    code: 'ENHEIG',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Encoding headers ignored unless part of a request body with content multipart/*.'
  },
  {
    id: 'ENUM_MISSING_VALUES',
    code: 'ENMIVA',
    alternateLevels: [],
    level: 'error',
    message: 'Enum should not be an empty array.'
  },
  {
    id: 'ENUM_NOT_MET',
    code: 'ENNOME',
    alternateLevels: [],
    level: 'error',
    message: 'Value must be one of the provided enum value.'
  },
  {
    id: 'EXAMPLE_EXAMPLES_CONFLICT',
    code: 'EXEXCO',
    alternateLevels: [],
    level: 'error',
    message: 'Properties "example" and "examples" are mutually exclusive.'
  },
  {
    id: 'EXAMPLE_NOT_SERIALIZABLE',
    code: 'EXNOSE',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Example could not be serialized and therefore cannot be validated against the schema.'
  },
  {
    id: 'EXAMPLE_NOT_VALID',
    code: 'EXNOVA',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Example is not valid when compared against the schema.'
  },
  {
    id: 'EXAMPLE_VALUE_EXTERNAL_CONFLICT',
    code: 'EXVAEC',
    alternateLevels: [],
    level: 'error',
    message: 'Cannot have both "externalValue" and "value" properties.'
  },
  {
    id: 'EXAMPLE_WITHOUT_SCHEMA',
    code: 'EXWISC',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'opinion',
    message: 'An example is great, but you should add a schema. A schema can provide more detailed information than an example.'
  },
  {
    id: 'EXCEEDS_NUMBER_BOUNDS',
    code: 'EXNUBO',
    alternateLevels: [],
    level: 'error',
    message: 'Value exceeds number bounds.'
  },
  {
    id: 'EXCEEDS_STRING_LENGTH_BOUNDS',
    code: 'EXSTLB',
    alternateLevels: [],
    level: 'error',
    message: ''
  },
  {
    id: 'EXCEEDS_SUMMARY_LENGTH',
    code: 'EXSULE',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Summary should be kept short with a recommendation of less than 120 characters. Current length: ${length}'
  },
  {
    id: 'EXTENSION_NOT_ALLOWED',
    code: 'EXNOAL',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Schema extensions not allowed here.'
  },
  {
    id: 'INVALID_ADDITIONAL_PROPERTIES_SCHEMA',
    code: 'INADPS',
    alternateLevels: [],
    level: 'error',
    message: 'Additional properties must be either a boolean or a valid schema definition.'
  },
  {
    id: 'INVALID_COOKIE_EXPLODE',
    code: 'INCOEX',
    alternateLevels: [],
    level: 'error',
    message: 'Cookies do not support exploded values for schemas of type array or object.'
  },
  {
    id: 'INVALID_EMAIL',
    code: 'INVEMA',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Value does not appear to be a valid email address: ${invalidValue}'
  },
  {
    id: 'INVALID_MAX_MIN',
    code: 'INMAMI',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Property ${minProperty} (${minimum}) must be less than ${maxProperty} ($maximum}).'
  },
  {
    id: 'INVALID_MEDIA_TYPE',
    code: 'INMETY',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Media type appears invalid: ${mediaType}'
  },
  {
    id: 'INVALID_OPENAPI_VERSION_NUMBER',
    code: 'INOPVN',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'OpenAPI specification version not supported: ${version}'
  },
  {
    id: 'INVALID_RESPONSE_CODE',
    code: 'INRECO',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Invalid response code: ${code}'
  },
  {
    id: 'INVALID_RESPONSE_LINK_KEY',
    code: 'INRELK',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Invalid key used for link value: ${key}'
  },
  {
    id: 'INVALID_SEMANTIC_VERSION_NUMBER',
    code: 'INSEVN',
    alternateLevels: [],
    level: 'error',
    message: 'Value must be a semantic version number.'
  },
  {
    id: 'INVALID_PARAMETER_STYLE',
    code: 'INPAST',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Style {$style} is incompatible with schema type: ${type}'
  },
  {
    id: 'INVALID_TYPE',
    code: 'INVTYP',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Invalid type. Expected ${expectedType}. Received: ${invalidValue}'
  },
  {
    id: '',
    code: '',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: '',
    message: ''
  },
  // {
  //   id: '',
  //   code: '',
  //   alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
  //   level: '',
  //   message: ''
  // },
  {
    id: 'EXCEPTION_LEVEL_CHANGE_INVALID',
    code: 'EXLECI',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Unable to change exception level for ${id} [${code}] to "${newLevel}". Accepted levels include: "${allowedLevels}'
  }
]

export function getExceptionMessageData (id: string, inputs: Record<string, any>, context: Context): ExceptionMessageDataInput {
  // populate the
  const item = list.find(o => o.id === id)
  const result: ExceptionMessageDataInput = Object.assign({}, item, {
    definition: context.definition,
    locations: context.locations,
    metadata: inputs,
    reference: context.reference ?? ''
  })

  // perform string replacement on the message
  Object.keys(inputs).forEach(key => {
    const value: any = inputs[key]
    const rx = new RegExp('\\${' + key + '}', 'g')
    result.message = result.message.replace(rx, smart(value))
  })

  return result
}
