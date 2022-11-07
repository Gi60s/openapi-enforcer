import { IContact2Definition, IContact3Definition, IContact2, IContact3 } from './IContact'
import { IComponentSchemaDefinition } from '../IComponentSchema'
import rx from '../../rx'
import { emailInvalid, urlInvalid } from '../../Exception/methods'
import { getLocation as locate } from '../../Locator/Locator'

type Definition = IContact2Definition | IContact3Definition
type Built = IContact2 | IContact3

const schema: IComponentSchemaDefinition<Definition, Built> = {
  type: 'object',
  allowsSchemaExtensions: true,
  properties: [
    {
      name: 'name',
      schema: { type: 'string' }
    },
    {
      name: 'url',
      schema: {
        type: 'string'
      }
    },
    {
      name: 'email',
      schema: {
        type: 'string'
      }
    }
  ],
  after ({ cmp, root }): void {
    const { exception, mode } = root
    if (mode === 'validate') {
      const { definition } = cmp
      const { email, url } = definition

      if (typeof url === 'string') {
        if (!rx.url.test(url)) {
          exception.add(urlInvalid(cmp, url, [locate(definition, 'url', 'value')]))
        }
      }

      if (typeof email === 'string') {
        if (!rx.email.test(email)) {
          exception.add(emailInvalid(cmp, email, [locate(definition, 'email', 'value')]))
        }
      }
    }
  }
}

export function getSchema (): IComponentSchemaDefinition<Definition, Built> {
  return schema
}
