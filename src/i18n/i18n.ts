import { language as en } from './en'
import { smart } from '../util'

type IMessage = string | ((metdata: Record<string, any>) => string)

export type II18nMessageCode = keyof II18nMessagesMap

export interface II18nMessagesMap {
  COMPONENT_NAME_INVALID: IMessage
  CONTENT_TYPE_INVALID: IMessage
  DATA_STORE_REF_INVALID: IMessage
  DISCRIMINATOR_ILLEGAL: IMessage
  DISCRIMINATOR_MAPPING_INVALID: IMessage
  DISCRIMINATOR_REQUIRED_PROPERTY: IMessage
  ENUM_NOT_MET: IMessage
  I18N_LANGUAGE_NOT_DEFINED: IMessage
  I18N_MISSING_MESSAGES: IMessage
  LOADER_NOT_FOUND: IMessage
  LOADER_YAML_PARSE_ERROR: IMessage
  LOADER_YAML_SUPPORT_ERROR: IMessage
  LOCATOR_INVALID_REFERENCE: IMessage
  NOT_IMPLEMENTED: IMessage
  NULL_INVALID: IMessage
  OPERATION_BODY_FORM_CONFLICT: IMessage
  OPERATION_BODY_NOT_UNIQUE: IMessage
  OPERATION_CONSUMES_FORM_DATA: IMessage
  OPERATION_ID_NOT_UNIQUE: IMessage
  OPTIONS_INVALID: IMessage
  PARAMETER_NAMESPACE_CONFLICT: IMessage
  PARAMETER_PATH_NOT_DEFINED: IMessage
  PARAMETER_NOT_IN_PATH: IMessage
  PATH_ENDINGS_INCONSISTENT: IMessage
  PATH_MISSING_LEADING_SLASH: IMessage
  PATH_OPERATION_CONFLICT: IMessage
  PATH_SPEC_CONFLICT: IMessage
  PATH_NOT_FOUND: IMessage
  PATHS_EMPTY: IMessage
  PROPERTIES_MUTUALLY_EXCLUSIVE: IMessage
  PROPERTY_NOT_ALLOWED: IMessage
  PROPERTY_MISSING: IMessage
  PROPERTY_UNKNOWN: IMessage
  REF_CONFLICT: IMessage
  REF_NOT_ALLOWED: IMessage
  REF_NOT_RESOLVED: IMessage
  SCHEMA_NOT_MET: IMessage
  SCHEMA_NOT_DESERIALIZABLE: IMessage
  SCHEMA_NOT_RANDOMIZABLE: IMessage
  SCHEMA_NOT_SERIALIZABLE_TYPE: IMessage
  SCHEMA_TYPE_FORMAT_BINARY_LENGTH: IMessage
  SCHEMA_TYPE_FORMAT_BYTE_LENGTH: IMessage
  SCHEMA_TYPE_FORMAT_DATE_FORMAT: IMessage
  SCHEMA_TYPE_FORMAT_DATE_TIME_FORMAT: IMessage
  SCHEMA_TYPE_FORMAT_DATE_INVALID: IMessage
  SCHEMA_TYPE_FORMAT_DATE_LENGTH: IMessage
  SUMMERY_EXCEEDS_RECOMMENDED_LENGTH: IMessage
  URL_INVALID: IMessage
  VALUE_OUT_OF_RANGE: IMessage
  VALUE_TYPE_INVALID: IMessage
  VERSION_MISMATCH: IMessage // True
  VERSION_NOT_IMPLEMENTED: IMessage // Undefined
  VERSION_NOT_SUPPORTED: IMessage // FALSE
}

const languageStore: Record<string, II18nMessagesMap> = {}
const messageCodes: II18nMessageCode[] = Object.keys(en) as II18nMessageCode[]
let currentLanguageMap: II18nMessagesMap

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
}

export function getMessage (messageCode: II18nMessageCode, data?: Record<string, any>): string {
  const message = currentLanguageMap[messageCode]
  if (typeof message === 'function') {
    return injectMessageData(message(data ?? {}), data)
  } else if (typeof message !== 'undefined') {
    return injectMessageData(message, data)
  } else {
    return ''
  }
}

export function getLanguageMessage (languageCode: string, messageCode: II18nMessageCode, data?: Record<string, any>): string {
  verifyLanguage(languageCode)
  const languageMap = languageStore[languageCode]
  const message = languageMap[messageCode]
  if (typeof message === 'function') {
    return injectMessageData(message(data ?? {}), data)
  } else if (typeof message !== 'undefined') {
    return injectMessageData(message, data)
  } else {
    return ''
  }
}

function injectMessageData (message: string, data: Record<string, any> = {}): string {
  const rx = /(?:{([a-z]+)})|(?:{{([a-z]+)}})/ig
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
