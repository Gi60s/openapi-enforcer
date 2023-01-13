import { language as en } from './en'
import { smart } from '../util'

export type II18nMessageCode = keyof II18nMessagesMap

export interface II18nMessagesMap {
  COMPONENT_NAME_INVALID: string
  COMPONENT_VERSION_MISMATCH: string
  CONTENT_TYPE_INVALID: string
  I18N_LANGUAGE_NOT_DEFINED: string
  I18N_MISSING_MESSAGES: string
  LOADER_NOT_FOUND: string
  LOADER_YAML_PARSE_ERROR: string
  LOADER_YAML_SUPPORT_ERROR: string
  LOCATOR_INVALID_REFERENCE: string
  NOT_IMPLEMENTED: string
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
  PROPERTY_MISSING: string
  PROPERTY_UNKNOWN: string
  REF_CONFLICT: string
  REF_NOT_RESOLVED: string
  SCHEMA_NOT_MET: string
  SPEC_VERSION_NOT_SUPPORTED: string
  SUMMERY_EXCEEDS_RECOMMENDED_LENGTH: string
  URL_INVALID: string
  VALUE_OUT_OF_RANGE_MAX: string
  VALUE_OUT_OF_RANGE_MIN: string
  VALUE_TYPE_INVALID: string
}

const languageStore: Record<string, II18nMessagesMap> = {}
const messageCodes: II18nMessageCode[] = Object.keys(en) as II18nMessageCode[]
let currentLanguageMap: II18nMessagesMap

addLanguage('en', en)
setLanguage('en')

export function addLanguage (languageCode: string, i18nMessageMap: II18nMessagesMap): void {
  const missingMessageCodes: II18nMessageCode[] = []
  Object.keys(messageCodes).forEach((messageCode: string) => {
    const code = messageCode as II18nMessageCode
    if (typeof i18nMessageMap[code] !== 'string') {
      missingMessageCodes.push(code)
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
  return message === undefined ? '' : injectMessageData(message, data)
}

export function getLanguageMessage (languageCode: string, messageCode: II18nMessageCode, data?: Record<string, any>): string {
  verifyLanguage(languageCode)
  const languageMap = languageStore[languageCode]
  const message = languageMap[messageCode]
  return message === undefined ? '' : injectMessageData(message, data)
}

function injectMessageData (message: string, data: Record<string, any> = {}): string {
  const rx = /{{([a-z]+)}}/ig
  let result = ''
  let match = rx.exec(message)
  let offset = 0
  while (match !== null) {
    const key = match[1]
    if (data[key] !== undefined) {
      result += message.substring(offset, match.index)
      result += smart(data[key])
      offset = match.index + match.length
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
