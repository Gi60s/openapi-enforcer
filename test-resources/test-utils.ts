import { EnforcerComponent } from '../src/components/Component'

interface TestMultipleComponentsResult<T> {
  test: (fn: ((component: T) => void)) => void
  testAsync: (fn: ((component: T) => Promise<void>)) => Promise<void>
}

export function testMultipleComponents<T extends EnforcerComponent<any>> (components: T[]): TestMultipleComponentsResult<T> {
  return {
    test: function (test: (component: T) => void): void {
      const length = components.length
      for (let i = 0; i < length; i++) {
        test(components[i])
      }
    },
    testAsync: async function (test: (component: T) => void): Promise<void> {
      const length = components.length
      for (let i = 0; i < length; i++) {
        await test(components[i])
      }
    }
  }
}
