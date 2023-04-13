import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISchema2Definition, ISchema3Definition } from './ISchema'
import { ILocation } from '../../Locator/ILocator'
import { getLocation } from '../../Loader'

type IDefinition = ISchema2Definition | ISchema3Definition

export function allOfMerge (exception: ExceptionStore, definitions: IDefinition[]) {
  // check for type and format conflicts
  const types = new Set<string>()
  const formats = new Set<string>()
  const typesLocations: ILocation[] = []
  const formatsLocations: ILocation[] = []
  getMergeTypes(definitions, types, formats, typesLocations, formatsLocations)

  if (types.size > 1) {
    exception.add({
      code: 'SCHEMA_ALL_TYPES_CONFLICT',
      id: 'SCHEMA',
      level: 'error',
      locations: typesLocations,
      metadata: {
        types: Array.from(types)
      }
    })
  }

  if (formats.size > 1) {
    exception.add({
      code: 'SCHEMA_ALL_FORMATS_CONFLICT',
      id: 'SCHEMA',
      level: 'error',
      locations: formatsLocations,
      metadata: {
        formats: Array.from(formats)
      }
    })
  }

}

function getMergeTypes (schemas: IDefinition[], types: Set<string>, formats: Set<string>, typesLocations: ILocation[], formatsLocations: ILocation[]): void {
  schemas.forEach(schema => {
    if (typeof schema.format === 'string') {
      formats.add(schema.format)
      const location = getLocation(schema, 'format', 'value')
      if (location !== undefined) formatsLocations.push(location)
    }
    if (typeof schema.type === 'string') {
      formats.add(schema.type)
      const location = getLocation(schema, 'type', 'value')
      if (location !== undefined) typesLocations.push(location)
    }
    if (schema.allOf !== undefined) getMergeTypes(schema.allOf as IDefinition[], types, formats, typesLocations, formatsLocations)
  })
}
