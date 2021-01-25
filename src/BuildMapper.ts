import { Validator } from './definition-validator'

export interface IBuildMapper {
  getMappedBuild: (definition: object, schema: Validator.SchemaObject) => BuildItem | undefined
  setMappedBuild: (definition: object, validator: Validator.SchemaObject, built: object, success?: boolean) => undefined
}

interface BuildItem {
  built: object
  success: boolean
  schema: Validator.SchemaObject
}

export function BuildMapper (): IBuildMapper {
  const map = new WeakMap()

  function getMappedBuild (definition: object, schema: Validator.SchemaObject): BuildItem | undefined {
    const existing = map.get(definition)
    if (existing) {
      return existing.find((v: BuildItem) => {
        return v.schema === schema
      })
    }
  }

  function setMappedBuild (definition: object, schema: Validator.SchemaObject, built: object, success: boolean = true): undefined {
    let existing = map.get(definition)

    if (!existing) {
      existing = []
      map.set(definition, existing)
    }

    const found = existing.find((v: BuildItem) => v.schema === schema)
    if (found) {
      found.built = built
      found.success = success
    } else {
      existing.push({ schema, built, success })
    }
  }

  return {
    getMappedBuild,
    setMappedBuild
  }
}
