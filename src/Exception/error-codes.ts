import { Data } from '../components'
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
    id: 'EXAMPLE_MEDIA_TYPE_NOT_PRODUCED',
    code: 'EXMTNP',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Example uses media type "${mediaType}" that is not listed in the possible list of produces: ${produces}'
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
    id: 'INVALID_URL',
    code: 'INVURL',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Value does not appear to be a valid URL: ${invalidUrl}'
  },
  {
    id: 'INVALID_VALUE',
    code: 'INVVAL',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Value is not valid. Expected "${expected}". Received: ${invalidValue}'
  },
  {
    id: 'INVALID_VALUE_FORMAT',
    code: 'INVAFO',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Expected ${type} of the format ${format}. Received: ${invalidValue}'
  },
  {
    id: 'INVALID_VERSION_FOR_COMPONENT',
    code: 'INVEFC',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: '${componentName} object is not supported by the OpenAPI specification version ${version}.'
  },
  {
    id: 'LINK_OPERATION_CONFLICT',
    code: 'LIOPCO',
    alternateLevels: [],
    level: 'error',
    message: 'The operationId and operationRef are mutually exclusive.'
  },
  {
    id: 'LOADER_FAILED_TO_LOAD_RESOURCE',
    code: 'LOFTLR',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Unable to load resource: ${path}. Cause: ${cause}.'
  },
  {
    id: 'LOADER_PATH_NOT_CACHED',
    code: 'LOPANC',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Cannot find node for path: ${path}'
  },
  {
    id: 'LOADER_NOT_AVAILABLE',
    code: 'LONOAV',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'No defined loaders were able to load the path: ${path}'
  },
  {
    id: 'MEDIA_TYPE_SCHEMA_MUST_BE_OBJECT',
    code: 'MTSMBO',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'MediaType schema must be of type "object". Received type: ${type}'
  },
  {
    id: 'MISSING_REQUIRED_PROPERTIES',
    code: 'MIMEPR',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Missing required properties: ${properties}'
  },
  {
    id: 'MUST_NOT_BE_NULL',
    code: 'MUNOBN',
    alternateLevels: [],
    level: 'error',
    message: 'Value must not be null.'
  },
  {
    id: 'NO_PATHS_DEFINED',
    code: 'NOPADE',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'No paths defined.'
  },
  {
    id: 'NOT_MULTIPLE_OF',
    code: 'NOMUOF',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Expected a multiple of ${multipleOf}. Received: ${invalidValue}'
  },
  {
    id: 'OPERATION_METHOD_REQUEST_BODY_NOT_ADVISED',
    code: 'OMRBNA',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Including a request body with a ${upperMethod} request is not advised. Some implementations may reject ${upperMethod} requests that contain a request body.'
  },
  {
    id: 'OPERATION_ID_MUST_BE_UNIQUE',
    code: 'OPIMBU',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'The operationId ${operationId} must be unique for each operation.'
  },
  {
    id: 'PATH_ENDINGS_INCONSISTENT',
    code: 'PAENIN',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Path endings are inconsistent. Some paths end with a slash and some do not. This may cause confusion for users of your API.'
  },
  {
    id: 'PATH_MISSING_METHODS',
    code: 'PAMIME',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'No methods defined for path: ${path}'
  },
  {
    id: 'PATH_PARAMETER_MUST_BE_REQUIRED',
    code: 'PAPMBR',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Path parameters must be marked as required. Parameter: ${parameterName}'
  },
  {
    id: 'PROPERTY_NOT_ALLOWED',
    code: 'PRNOAL',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Property ${propertyName} not allowed. ${reason}'
  },
  {
    id: 'RANDOM_PASSWORD_WARNING',
    code: 'RAPAWA',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'It may not be safe to use this random value as a password. Passwords generated here are not cryptographically secure.'
  },
  {
    id: 'REF_INFINITE_LOOP',
    code: 'REINLO',
    alternateLevels: [],
    level: 'error',
    message: 'Reference is an unresolvable infinite loop.'
  },
  {
    id: 'REF_INVALID_START',
    code: 'REINST',
    alternateLevels: [],
    level: 'error',
    message: 'References must start with #/'
  },
  {
    id: 'REF_NOT_RESOLVED',
    code: 'RENORE',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Cannot resolve reference ${ref} from ${from}.'
  },
  {
    id: 'RESPONSE_BODY_NOT_ALLOWED',
    code: 'REBONA',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'A 204 response must not contain a body but this response has a defined ${type}.'
  },
  {
    id: 'RESPONSE_REQUIRED',
    code: 'RESREQ',
    alternateLevels: [],
    level: 'error',
    message: 'Responses object must define at least one response.'
  },
  {
    id: 'RESPONSE_SHOULD_INCLUDE_LOCATION_HEADER',
    code: 'RESILC',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'A 201 response for a POST request should return a location header and this is not documented in your OpenAPI document.'
  },
  {
    id: 'RESPONSE_SHOULD_INCLUDE_SUCCESS',
    code: 'RESHIS',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    message: 'Responses object should define at least one success (200 level) response or a default response.'
  },
  {
    id: 'SECURITY_REQUIREMENT_NOT_EMPTY_ARRAY',
    code: 'SERNEA',
    alternateLevels: [],
    level: 'error',
    message: 'Security requirement value must be an empty array unless associated security scheme type is oauth2 or openIdConnect.'
  },
  {
    id: 'SECURITY_SCHEME_MISSING_REFERENCE',
    code: 'SESCMR',
    alternateLevels: [],
    level: 'error',
    message: 'Security scheme name must have an associated reference in the SecurityDefinitions (OAS 2) or SecuritySchemes (OAS 3).'
  },
  {
    id: 'SECURITY_SCHEME_NOT_URL',
    code: 'SESCNU',
    alternateLevels: [],
    level: 'error',
    message: 'Value must be a URL.'
  },
  {
    id: 'SWAGGER_BASE_PATH_INVALID',
    code: 'SWBAPI',
    alternateLevels: [],
    level: 'error',
    message: 'The base path must start with a forward slash.'
  },
  {
    id: 'SWAGGER_BASE_PATH_TEMPLATING',
    code: 'SWBAPT',
    alternateLevels: [],
    level: 'error',
    message: 'The base path does not support path templating.'
  },
  {
    id: 'SWAGGER_HOST_DOES_NOT_SUPPORT_PATH_TEMPLATING',
    code: 'SHDNSP',
    alternateLevels: [],
    level: 'error',
    message: 'The host does not support path templating.'
  },
  {
    id: 'SWAGGER_HOST_HAS_SCHEME',
    code: 'SWHOHS',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'The host must not include the scheme: ${scheme}'
  },
  {
    id: 'SWAGGER_HOST_HAS_SUBPATH',
    code: 'SWHHAS',
    alternateLevels: [],
    level: 'error',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'The host must not include sub path: ${subPath}'
  },
  {
    id: 'UNKNOWN_TYPE_FORMAT',
    code: 'UNTYFO',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'Non-standard format "${format}" used for type "${type}".'
  },
  {
    id: 'VALUE_IGNORED',
    code: 'VALIGN',
    alternateLevels: ['ignore', 'opinion', 'warn', 'error'],
    level: 'warn',
    // eslint-disable-next-line no-template-curly-in-string
    message: 'The following value will be ignored: ${value}. ${reason}'
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
  // populate the data input
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
