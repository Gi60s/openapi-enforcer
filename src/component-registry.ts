
import * as Callback from './components/Callback'
import * as Components from './components/Components'
import * as Contact from './components/Contact'
import * as Discriminator from './components/Discriminator'
import * as Encoding from './components/Encoding'
import * as Example from './components/Example'
import * as ExternalDocumentation from './components/ExternalDocumentation'
import * as Header from './components/Header'
import * as Info from './components/Info'
import * as Item from './components/Item'
import * as License from './components/License'
import * as Link from './components/Link'
import * as MediaType from './components/MediaType'
import * as OAuthFlow from './components/OAuthFlow'
import * as OAuthFlows from './components/OAuthFlows'
import * as OpenAPI from './components/OpenAPI'
import * as Operation from './components/Operation'
import * as Parameter from './components/Parameter'
import * as PathItem from './components/PathItem'
import * as Paths from './components/Paths'
import * as RequestBody from './components/RequestBody'
import * as Response from './components/Response'
import * as Responses from './components/Responses'
import * as Schema from './components/Schema'
import * as SecurityRequirement from './components/SecurityRequirement'
import * as SecurityScheme from './components/SecurityScheme'
import * as Swagger from './components/Swagger'
import * as Server from './components/Server'
import * as ServerVariable from './components/ServerVariable'
import * as Tag from './components/Tag'
import * as Xml from './components/Xml'

import { AnyComponent, v2, v3 } from './components'
import { Controller as DataTypes } from './data-type-format/controller'
import { ValidatorFactory } from './definition-validator'

const registry: Registry = {
  '2.0': null,
  '3.0.0': null,
  '3.0.1': null,
  '3.0.2': null,
  '3.0.3': null
}

const map: WeakMap<AnyComponent, ComponentDefinition> = new WeakMap()

export interface ComponentDefinition {
  component: AnyComponent
  dataTypes?: DataTypes
  validator: ValidatorFactory<unknown, unknown>
  versions: Reference
}

export interface Details {
  name: Number
  major: number
  minor: number
  patch: number
}

export type Number = '2.0' | '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'

export interface Reference {
  '2.0'?: string
  '3.0.0'?: string
  '3.0.1'?: string
  '3.0.2'?: string
  '3.0.3'?: string
}

interface Registry {
  '2.0': v2
  '3.0.0': v3
  '3.0.1': v3
  '3.0.2': v3
  '3.0.3': v3
}

export function components (version: Number): v2 | v3  {
  initialize()
  return registry[version]
}

// register all components
let initialized: boolean = false
function initialize () {
  if (initialized) return
  initialized = true

  register(Callback.register)
  register(Components.register)
  register(Contact.register)
  register(Discriminator.register)
  register(Encoding.register)
  register(Example.register)
  register(ExternalDocumentation.register)
  register(Header.register)
  register(Info.register)
  register(Item.register)
  register(License.register)
  register(Link.register)
  register(MediaType.register)
  register(OAuthFlow.register)
  register(OAuthFlows.register)
  register(OpenAPI.register)
  register(Operation.register)
  register(Parameter.register)
  register(PathItem.register)
  register(Paths.register)
  register(RequestBody.register)
  register(Response.register)
  register(Responses.register)
  register(Schema.register)
  register(SecurityRequirement.register)
  register(SecurityScheme.register)
  register(Swagger.register)
  register(Server.register)
  register(ServerVariable.register)
  register(Tag.register)
  register(Xml.register)
}

function register ({ component, dataTypes, validator, versions }: ComponentDefinition): AnyComponent {
  const name = component.name
  Object.keys(versions)
    .forEach((version: Number) => {
      const [ major, minor, patch ] = version.split('.').filter(v => /^\d+$/.test(v)).map(v => +v)

      // @ts-expect-error
      const wrapperClass: AnyComponent = {
        [name]: class extends component {
          public readonly $reference: string
          public readonly $version: Details

          constructor (definition: any) {
            super(definition)
            this.$reference = versions[version]
            this.$version = {
              name: version,
              major,
              minor,
              patch
            }
          }
        }
      }[name]

      // @ts-expect-error
      registry[version][name] = wrapperClass

      map.set(wrapperClass, {
        component: wrapperClass,
        dataTypes,
        validator,
        versions
      })
    })
  return component
}