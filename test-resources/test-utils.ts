import { EnforcerComponent } from '../src/components/Component'

interface TestMultipleComponentsResult<T> {
  test: (fn: ((component: T) => void)) => void
  testAsync: (fn: ((component: T) => Promise<void>)) => Promise<void>
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
          e.message = component.id + ': ' + String(e.message ?? '')
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
    }
  }
}
