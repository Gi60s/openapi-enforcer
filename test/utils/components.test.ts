import { ComponentSchema, OASComponent, SchemaObject, Version, ExtendedComponent } from '../../src/components'
import { expect } from 'chai'
import { copy } from '../../src/utils/util'

const basicSchemaObject: ComponentSchema = {
  allowsSchemaExtensions: true,
  properties: [
    { name: 'any', schema: { type: 'any' } },
    {
      name: 'array',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          allowsSchemaExtensions: false,
          properties: [
            { name: 'x', schema: { type: 'number' } },
            { name: 'y', schema: { type: 'number' } }
          ]
        }
      }
    },
    { name: 'boolean', schema: { type: 'boolean', default: true } },
    { name: 'number', schema: { type: 'number' } },
    {
      name: 'object',
      schema: {
        type: 'object',
        allowsSchemaExtensions: false,
        properties: [
          { name: 'x', schema: { type: 'number' } },
          { name: 'y', schema: { type: 'number' } }
        ]
      }
    },
    {
      name: 'oneOf',
      schema: {
        type: 'oneOf',
        oneOf: [
          {
            condition: (data) => typeof data.context.definition === 'boolean',
            schema: { type: 'boolean' }
          },
          {
            condition: (data) => typeof data.context.definition === 'string',
            schema: { type: 'string' }
          }
        ],
        error: () => {
          return {
            alternateLevels: [],
            code: '',
            definition: '',
            id: '',
            level: 'error',
            locations: [],
            message: 'No conditions met',
            metadata: {},
            reference: ''
          }
        }
      }
    },
    { name: 'string', schema: { type: 'string' } }
  ]
}

interface BasicDefinition {
  [key: `x-${string}`]: any
  any?: any
  array?: Array<{ x?: number, y?: number }>
  boolean?: boolean
  number?: number
  object?: {
    x?: number
    y?: number
  }
  oneOf?: boolean | string
  string?: string
}

class Basic extends OASComponent {
  readonly [key: `x-${string}`]: any
  readonly any?: any
  readonly array?: Array<{ x?: number, y?: number }>
  readonly boolean!: boolean
  readonly number?: number
  readonly object?: { x?: number, y?: number }
  readonly string?: string

  constructor (definition: BasicDefinition, version?: Version) {
    super(Basic, definition, version, arguments[2])
  }

  static schemaGenerator (): ComponentSchema {
    return copy(basicSchemaObject)
  }

  static spec = {
    '2.0': 'Spec URL 2.0',
    '3.0.0': 'Spec URL 3.0.0',
    '3.0.1': 'Spec URL 3.0.1',
    '3.0.2': 'Spec URL 3.0.2',
    '3.0.3': 'Spec URL 3.0.3'
  }
}

interface HasChildComponentDefinition extends BasicDefinition {
  component?: BasicDefinition
}

class HasChildComponent extends OASComponent {
  readonly any?: any
  readonly array?: Array<{ x?: number, y?: number }>
  readonly boolean!: boolean
  readonly component?: Basic
  readonly number?: number
  readonly object?: { x?: number, y?: number }
  readonly string?: string

  constructor (definition: HasChildComponentDefinition, version?: Version) {
    super(HasChildComponent, definition, version, arguments[2])
  }

  static schemaGenerator (): ComponentSchema {
    const schema = copy<ComponentSchema>(basicSchemaObject)
    schema.properties?.push({
      name: 'component',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Basic
      }
    })
    return schema
  }

  static spec = {
    '2.0': 'Spec URL...',
    '3.0.0': 'Spec URL...',
    '3.0.1': 'Spec URL...',
    '3.0.2': 'Spec URL...',
    '3.0.3': 'Spec URL...'
  }
}

interface LoopComponentDefinition extends BasicDefinition {
  component?: LoopComponentDefinition
  object?: { x?: number, y?: number, z?: object }
}

class LoopComponent extends OASComponent {
  readonly any?: any
  readonly array?: Array<{ x?: number, y?: number }>
  readonly boolean!: boolean
  readonly component?: LoopComponent
  readonly number?: number
  readonly object?: { x?: number, y?: number, z?: object }
  readonly string?: string

  constructor (definition: LoopComponentDefinition, version?: Version) {
    super(LoopComponent, definition, version, arguments[2])
  }

  static schemaGenerator (): ComponentSchema {
    const schema = copy<ComponentSchema>(basicSchemaObject)
    const objectProperty = typeof schema === 'object' && schema !== null ? schema.properties?.find(p => p.name === 'object') : undefined
    if (objectProperty !== undefined) {
      // @ts-expect-error
      objectProperty.schema.properties.push({ name: 'z', schema: objectProperty.schema })
    }
    schema.properties?.push({
      name: 'component',
      schema: {
        type: 'component',
        allowsRef: false,
        component: LoopComponent
      }
    })
    return schema
  }

  static spec = {
    '2.0': 'Spec URL...',
    '3.0.0': 'Spec URL...',
    '3.0.1': 'Spec URL...',
    '3.0.2': 'Spec URL...',
    '3.0.3': 'Spec URL...'
  }
}

describe('Generic component tests', () => {
  describe('build', () => {
    it('can create basic component', function () {
      const basic = new Basic({ boolean: true })
      expect(basic).to.be.instanceOf(Basic)
    })

    it('will add defaults', function () {
      const component = new Basic({})
      expect(component).to.be.instanceOf(Basic)
      expect(component.boolean).to.equal(true)
    })

    it('will load child components', function () {
      const component = new HasChildComponent({
        component: { string: 'hello' }
      })
      expect(component).to.be.instanceOf(HasChildComponent)
      expect(component.component).to.be.instanceOf(Basic)
    })

    it('will load recursive components', () => {
      const def: LoopComponentDefinition = {
        component: { string: 'hello' }
      }
      // @ts-expect-error
      def.component.component = def

      const component = new LoopComponent(def)
      expect(component).to.be.instanceOf(LoopComponent)
      expect(component.component?.component).to.equal(component)
      expect(component.component?.component?.component?.component).to.equal(component)
    })

    it('will load recursive objects', () => {
      const obj: LoopComponentDefinition['object'] = {}
      const def: LoopComponentDefinition = { object: obj }
      obj.z = obj

      const component = new LoopComponent(def)
      expect(component.object).to.equal(component.object?.z)
    })

    it('will not add unknown properties', function () {
      // @ts-expect-error
      const component = new Basic({ foo: 'string' })
      expect(component).to.be.instanceOf(Basic)
    })

    it('will add extension properties if extensions allowed', function () {
      const component = new Basic({ 'x-foo': 'string' })
      expect(component).to.be.instanceOf(Basic)
      expect(component['x-foo']).to.equal('string')
    })

    it('will not add extension properties if extensions not allowed', function () {
      const component = new Basic({
        // @ts-expect-error
        object: { 'x-foo': 'string' }
      })
      expect(component).to.be.instanceOf(Basic)
      expect(component.object).not.to.haveOwnProperty('x-foo')
    })

    it('before function is run during build', function () {
      let count = 0
      const Test = TestComponent({
        allowsSchemaExtensions: false,
        builder: {
          before () {
            count++
            return true
          }
        }
      })
      const t = new Test({})
      expect(t).to.be.instanceOf(Test)
      expect(count).to.equal(1)
    })

    it('after function is run during build', function () {
      let count = 0
      const Test = TestComponent({
        allowsSchemaExtensions: false,
        builder: {
          after () { count++ }
        }
      })
      const t = new Test({})
      expect(t).to.be.instanceOf(Test)
      expect(count).to.equal(1)
    })

    describe('type validation', () => {
      it('will allow any value for type any', function () {
        expect(() => new Basic({ any: true })).not.to.throw(Error)
        expect(() => new Basic({ any: [] })).not.to.throw(Error)
        expect(() => new Basic({ any: {} })).not.to.throw(Error)
        expect(() => new Basic({ any: 'hello' })).not.to.throw(Error)
        expect(() => new Basic({ any: 2 })).not.to.throw(Error)
      })

      it('will throw an error if value is not an array for type array', function () {
        // @ts-expect-error
        expect(() => new Basic({ array: true })).to.throw(/Expected an array/)
      })

      it('will throw an error if value is not a boolean for type boolean', function () {
        // @ts-expect-error
        expect(() => new Basic({ boolean: 5 })).to.throw(/Expected a boolean/)
      })

      it('will throw an error if value is not an object for type component', function () {
        // @ts-expect-error
        expect(() => new HasChildComponent({ component: 5 })).to.throw(/Expected an object/)
      })

      it('will throw an error if value is not a number for type number', function () {
        // @ts-expect-error
        expect(() => new Basic({ number: true })).to.throw(/Expected a number/)
      })

      it('will throw an error if value is not an object for type object', function () {
        // @ts-expect-error
        expect(() => new Basic({ object: 5 })).to.throw(/Expected an object/)
      })

      it('will throw an error if value is not meet one of the conditions of type oneOf', function () {
        // @ts-expect-error
        expect(() => new Basic({ oneOf: 5 })).to.throw(/Definition does not meet any of the possible conditions/)
      })

      it('will throw an error if value is not a string for type string', function () {
        // @ts-expect-error
        expect(() => new Basic({ string: true })).to.throw(/Expected a string/)
      })
    })
  })

  describe('validate', function () {
    describe('x-enforcer', () => {
      it('is allowed even if extensions are not allowed', function () {
        const Test = TestComponent({
          allowsSchemaExtensions: false
        })
        const [error, warn, opinion] = Test.validate({ 'x-enforcer': {} })
        expect(error).to.equal(undefined)
        expect(warn).to.equal(undefined)
        expect(opinion).to.equal(undefined)
      })
    })

    describe('after function', function () {
      it('is will run during validate', function () {
        let count = 0
        const Test = TestComponent({
          allowsSchemaExtensions: false,
          validator: {
            after () { count++ }
          }
        })
        const t = new Test({})
        expect(t).to.be.instanceOf(Test)
        expect(count).to.equal(0)
      })

      it('will not run if before function returns false', function () {
        let count = 0
        const Test = TestComponent({
          allowsSchemaExtensions: false,
          validator: {
            before () { return false },
            after () { count++ }
          }
        })
        Test.validate({})
        expect(count).to.equal(0)
      })

      it('will not run if there are errors', function () {
        let count = 0
        const Test = TestComponent({
          allowsSchemaExtensions: false,
          validator: {
            after () {
              count++
            }
          },
          properties: [
            {
              name: 'required',
              required: true,
              schema: { type: 'string' }
            }
          ]
        })
        const [error] = Test.validate({})
        expect(error?.count).to.equal(1)
        expect(count).to.equal(0)
      })
    })

    describe('before function', function () {
      it('is run during validate', function () {
        let count = 0
        const Test = TestComponent({
          allowsSchemaExtensions: false,
          validator: {
            before () {
              count++
              return true
            }
          }
        })
        Test.validate({})
        expect(count).to.equal(1)
      })

      it('will stop all other validations from running if before returns false', function () {
        const Test = TestComponent({
          allowsSchemaExtensions: false,
          validator: {
            before () { return false }
          },
          properties: [
            {
              name: 'required',
              required: true,
              schema: { type: 'string' }
            }
          ]
        })
        const [error] = Test.validate({})
        expect(error).to.equal(undefined)
      })
    })
  })

  describe('type: object', () => {
    describe('required properties', () => {
      class Test extends OASComponent {
        readonly required!: boolean

        constructor (definition: any, version?: Version) {
          super(Test, definition, version, arguments[2])
        }

        static spec = {
          '3.0.0': ''
        }

        static schemaGenerator (): SchemaObject {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            properties: [
              {
                name: 'required',
                required: true,
                schema: {
                  type: 'boolean'
                }
              }
            ]
          }
        }
      }

      it('build does not check for required properties', function () {
        const test = new Test({})
        expect(test).to.be.instanceOf(Test)
      })

      it('validate does check for required properties', function () {
        const [error] = Test.validate({})
        expect(error).to.match(/Missing required property: required/)
      })
    })
  })
})

function TestComponent (schema: ComponentSchema): ExtendedComponent {
  return class Test extends OASComponent {
    constructor (definition: any, version?: Version) {
      super(Test, definition, version, arguments[2])
    }

    static schemaGenerator (): ComponentSchema {
      return schema
    }

    static spec = {
      '3.0.0': ''
    }
  }
}
