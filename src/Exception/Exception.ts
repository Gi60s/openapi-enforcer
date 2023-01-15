import { IException, IExceptionData, IExceptionLevel } from './IException'
import { ILocation } from '../Locator/ILocator'
import { II18nMessageCode } from '../i18n/i18n'

export class Exception implements IException {
  public readonly id: string
  public readonly code: II18nMessageCode
  public readonly level: IExceptionLevel
  public readonly levelOverwritten: boolean
  public readonly locations!: ILocation[]
  public readonly metadata: Record<string, any>
  public readonly reference: string

  constructor (data: IExceptionData) {
    this.id = data.id + '_' + data.code
    this.code = data.code
    this.level = data.level
    this.levelOverwritten = data.levelOverwritten ?? false
    this.locations = data.locations.filter(location => location !== undefined) as ILocation[]
    this.metadata = data.metadata ?? {}
    this.reference = data.reference ?? ''
  }
}

/*
=== ERRORS ===
One or more errors found:
  at: info > title (openapi.yml 2:2)
    [info.title.required] The title property is required (https://spec.openapis.org/oas/v3.0.0#info-object)
    [info.title.type] The title property must be a string (https://spec.openapis.org/oas/v3.0.0#info-object)
  at: paths > / > get > responses (openapi.yml 10:18)
    [responses.code.invalid] Response code invalid: "OK"  (https://spec.openapis.org/oas/v3.0.0#responses-object)
  at: paths > / > get > responses > OK > foo: (openapi.yml 11:20)
    [response.propertyNotAllowed] Property "foo" is not allowed. (https://spec.openapis.org/oas/v3.0.0#response-object)
  at: components-old > schemas > Schema1 > maximum (openapi.yml 53:10)
    [schema.maximum.minConflict] Property maximum must be greater than or equal to minimum.
  at: components-old > schemas > Schema1 > minimum (openapi.yml 54:10)
    [schema.minimum.maxConflict] Property minimum must be less than or equal to maximum.
  at: components-old > schemas > Schema1 > default (openapi.yml 55:10)
    [schema.default.enum] Default value does not meet enum requirements.
    [schema.default.minimum] Default value is less than the allowed minimum.
  at: components-old > schemas > Schema1 > enum (openapi.yml 56:7)
    [schema.enum.empty] Enum cannot be empty.
  at: components-old > schemas > Schema2 > type (openapi.yml 60:10)
    [schema.type] Type must be one of string, array, object, ... (https://spec.openapis.org/oas/v3.0.0#foo)
  at: components-old > schemas > Schema2 > format (openapi.yml 61:12)
    [schema.format.unknown] Format is not recognized: "banana"

=== Multiple Locations for One Error ===

One or more errors found:
  at:
    components-old > schemas > Schema3 > default (openapi.yml 95:10)
    components-old > schemas > Schema3 > required (openapi.yml 95:10)
      [schema.conflict.defreq] Cannot have default value and be required.

=== Use Breadcrumb Tails instead of full breadcrumbs ===

One or more errors found:
  at: info > title (openapi.yml 2:2)
    [info.title.required] The title property is required (https://spec.openapis.org/oas/v3.0.0#info-object)
    [info.title.type] The title property must be a string (https://spec.openapis.org/oas/v3.0.0#info-object)
  at: ... > get > responses (openapi.yml 10:18)
    [responses.code.invalid] Response code invalid: "OK"  (https://spec.openapis.org/oas/v3.0.0#responses-object)
  at: ... > Schema2 > type (openapi.yml 60:10)
    [schema.type] Type must be one of string, array, object, ... (https://spec.openapis.org/oas/v3.0.0#foo)
  at: ... > Schema2 > format (openapi.yml 61:12)
    [schema.format.unknown] Format is not recognized: "banana"
 */