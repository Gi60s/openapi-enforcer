import { EnforcerComponent } from '../src/components/Component'
import { putInMemory, clearMemory } from '../src/Loader/loaders/loader.memory'
import { loadAsync } from '../src/Loader'
import { ExceptionStore } from '../src/Exception/ExceptionStore'

interface TestMultipleComponentsResult<T> {
  test: (fn: ((component: T) => void)) => void
  testAsync: (fn: ((component: T) => Promise<void>)) => Promise<void>
  validateDefinition: (component: T, definition: any) => Promise<ExceptionStore>
}

interface SchemaValidationTestSuite {
  validate: (definition: object) => SchemaValidationTestSuite
  assert: (callback: (es: ExceptionStore) => any) => (() => Promise<any>)
}

/**
 * Example usage:
 * it.only('test', SchemaValidationTest(...Schemas)
 *   .validate({
 *     allOf: [
 *       { minimum: 5, maximum: 10 },
 *       { type: 'number', minimum: 12 }
 *     ]
 *   })
 *   .assert(es => {
 *     expect(es).to.have.exceptionErrorCode('SCHEMA_ALLOF_CROSS_CONFLICT', true)
 *   })
 * )
 * @param components
 */
export function SchemaValidationTest<T extends typeof EnforcerComponent<any>> (...components: T[]): SchemaValidationTestSuite {
  clearMemory()
  const fullFileName = 'test_file.mem'

  const suite: SchemaValidationTestSuite = {
    validate (definition: any): SchemaValidationTestSuite {
      putInMemory(fullFileName, definition)
      return suite
    },
    assert (callback: (es: ExceptionStore) => void): (() => Promise<any>) {
      return async () => {
        const length = components.length
        const def = (await loadAsync(fullFileName)).value
        for (let i = 0; i < length; i++) {
          const component = components[i]
          try {
            const es = component.validate(def)
            callback(es)
          } catch (e: any) {
            // add to the error message which component failed
            e.message = component.id + ': ' + String(e.message ?? '')
            throw e
          }
        }
      }
    }
  }
  return suite
}

export function testMultipleComponents<T extends typeof EnforcerComponent<any>> (components: T[]): TestMultipleComponentsResult<T> {
  return {
    test: function (test: (component: T) => void): void {
      const length = components.length
      for (let i = 0; i < length; i++) {
        const component = components[i]
        try {
          test(component)
        } catch (e: any) {
          const versions = Object.keys(component.spec)
            .filter(v => typeof (component.spec as any)[v] === 'string')
            .join(', ')
          e.message = component.name + ' [' + versions + ']: ' + String(e.message ?? '')
          throw e
        }
      }
    },
    testAsync: async function (test: (component: T) => void): Promise<void> {
      const length = components.length
      for (let i = 0; i < length; i++) {
        const component = components[i]
        try {
          await test(components[i])
        } catch (e: any) {
          e.message = component.id + ': ' + String(e.message ?? '')
          throw e
        }
      }
    },
    validateDefinition: async function (component: T, definition: any): Promise<ExceptionStore> {
      try {
        putInMemory('x.mem', definition)
        const def = await loadAsync('x.mem')
        return component.validate(def.value)
      } catch (e: any) {
        e.message = component.id + ': ' + String(e.message ?? '')
        throw e
      }
    }
    // testDefinition: async function (definition: any, test: (es: ExceptionStore) => void): Promise<void> {
    //   const length = components.length
    //   for (let i = 0; i < length; i++) {
    //     const component = components[i]
    //     try {
    //       putInMemory('x.mem', definition)
    //       const def = await loadAsync('x.mem')
    //       const es = component.validate(def.value)
    //       test(es)
    //     } catch (e: any) {
    //       e.message = component.id + ': ' + String(e.message ?? '')
    //       throw e
    //     }
    //   }
    // }
  }
}
