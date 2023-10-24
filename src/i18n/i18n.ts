import { language as en } from './en'
import { smart } from '../util'

export type II18nMessageCode = keyof II18nMessagesMap

export interface II18nMessagesMap {
  COMPONENT_NAME_INVALID: string
  CONTENT_TYPE_INVALID: string
  DATA_STORE_REF_INVALID: string
  DISCRIMINATOR_ILLEGAL: string
  DISCRIMINATOR_MAPPING_INVALID: string
  DISCRIMINATOR_REQUIRED_PROPERTY: string
  ENUM_NOT_MET: string
  I18N_LANGUAGE_NOT_DEFINED: string
  I18N_MISSING_MESSAGES: string
  LOADER_NOT_FOUND: string
  LOADER_YAML_PARSE_ERROR: string
  LOADER_YAML_SUPPORT_ERROR: string
  LOCATOR_INVALID_REFERENCE: string
  LOADER_IN_MEMORY_NAME_INVALID: string
  NOT_IMPLEMENTED: string
  NULL_INVALID: string
  OPERATION_BODY_FORM_CONFLICT: string
  OPERATION_BODY_NOT_UNIQUE: string
  OPERATION_CONSUMES_FORM_DATA: string
  OPERATION_ID_NOT_UNIQUE: string
  OPTIONS_INVALID: string
  PARAMETER_NAMESPACE_CONFLICT: string
  PARAMETER_PATH_NOT_DEFINED: string
  PARAMETER_NOT_IN_PATH: string
  PATH_ENDINGS_INCONSISTENT: string
  PATH_MISSING_LEADING_SLASH: string
  PATH_OPERATION_CONFLICT: string
  PATH_SPEC_CONFLICT: string
  PATH_NOT_FOUND: string
  PATHS_EMPTY: string
  PROPERTIES_MUTUALLY_EXCLUSIVE: string
  PROPERTY_NOT_ALLOWED: string
  PROPERTY_NOT_ALLOWED_UNLESS_ARRAY: string
  PROPERTY_NOT_ALLOWED_UNLESS_NUMERIC: string
  PROPERTY_NOT_ALLOWED_UNLESS_OBJECT: string
  PROPERTY_NOT_ALLOWED_UNLESS_STRING: string
  PROPERTY_NOT_ALLOWED_UNLESS_VERSION: string
  PROPERTY_MISSING: string
  PROPERTY_UNKNOWN: string
  REF_CONFLICT: string
  REF_NOT_ALLOWED: string
  REF_NOT_RESOLVED: string
  SCHEMA_ALLOF_CONFLICT: string
  SCHEMA_ALLOF_CROSS_CONFLICT: string
  SCHEMA_ALLOF_EMPTY_ARRAY: string
  SCHEMA_NOT_MET: string
  SCHEMA_NOT_DESERIALIZABLE: string
  SCHEMA_NOT_RANDOMIZABLE: string
  SCHEMA_NOT_SERIALIZABLE_TYPE: string
  SCHEMA_TYPE_FORMAT_BINARY_LENGTH: string
  SCHEMA_TYPE_FORMAT_BYTE_LENGTH: string
  SCHEMA_TYPE_FORMAT_DATE_FORMAT: string
  SCHEMA_TYPE_FORMAT_DATE_INVALID: string
  SCHEMA_TYPE_FORMAT_DATE_LENGTH: string
  SCHEMA_TYPE_FORMAT_DATE_TIME_FORMAT: string
  SCHEMA_TYPE_FORMAT_DATE_TIME_LENGTH: string
  SCHEMA_TYPE_INDETERMINATE: string
  SCHEMA_TYPE_INVALID: string
  SCHEMA_TYPE_INVALID_FILE: string
  SCHEMA_TYPE_NOT_SPECIFIED: string
  SUMMERY_EXCEEDS_RECOMMENDED_LENGTH: string
  URL_INVALID: string
  VALUE_OUT_OF_RANGE_MAX: string
  VALUE_OUT_OF_RANGE_MAX_EXCLUSIVE: string
  VALUE_OUT_OF_RANGE_MIN: string
  VALUE_OUT_OF_RANGE_MIN_EXCLUSIVE: string
  VALUE_TYPE_INVALID: string
  VERSION_MISMATCH: string // True
  VERSION_NOT_IMPLEMENTED: string // Undefined
  VERSION_NOT_SUPPORTED: string // FALSE
}

const languageStore: Record<string, II18nMessagesMap> = {}
const messageCodes: II18nMessageCode[] = Object.keys(en) as II18nMessageCode[]
let currentLanguageMap: II18nMessagesMap
let currentLanguageCode: string

addLanguage('en', en)
setLanguage('en')

export function addLanguage (languageCode: string, i18nMessageMap: II18nMessagesMap): void {
  const missingMessageCodes: II18nMessageCode[] = []
  messageCodes.forEach(messageCode => {
    if (typeof i18nMessageMap[messageCode] !== 'string') {
      missingMessageCodes.push(messageCode)
    }
  })

  if (missingMessageCodes.length > 0) {
    throw Error(getMessage('I18N_MISSING_MESSAGES', { languageCode, missingMessageCodes }))
  }

  languageStore[languageCode] = i18nMessageMap
}

export function setLanguage (languageCode: string): void {
  verifyLanguage(languageCode)
  currentLanguageMap = languageStore[languageCode]
  currentLanguageCode = languageCode
}

export function getMessage (messageCode: II18nMessageCode, data?: Record<string, any>): string {
  const message = currentLanguageMap[messageCode]
  if (typeof message !== 'undefined') {
    return injectMessageData(currentLanguageCode, message, data)
  } else {
    return ''
  }
}

export function getLanguageMessage (languageCode: string, messageCode: II18nMessageCode, data?: Record<string, any>): string {
  verifyLanguage(languageCode)
  const languageMap = languageStore[languageCode]
  const message = languageMap[messageCode]
  if (typeof message !== 'undefined') {
    return injectMessageData(languageCode, message, data)
  } else {
    return ''
  }
}

function injectMessageData (languageCode: string, message: string, data: Record<string, any> = {}): string {
  const rx = /(?:{([a-z0-9]+)})|(?:{{([a-z0-9]+)}})/ig
  let result = ''
  let match = rx.exec(message)
  let offset = 0
  while (match !== null) {
    const addQuotationMarksToStrings = match[1] === undefined
    const key = match[1] ?? match[2]
    if (data[key] !== undefined) {
      result += message.substring(offset, match.index)
      result += smart(data[key], { addQuotationMarksToStrings })
      offset = match.index + match[0].length
    }
    match = rx.exec(message)
  }
  result += message.substring(offset)
  return result
}

function verifyLanguage (languageCode: string): void {
  if (languageStore[languageCode] === undefined) {
    throw Error(getMessage('I18N_LANGUAGE_NOT_DEFINED', { languageCode }))
  }
}
