import { OASComponent, initializeData, SchemaObject, Version, ExtendedComponent } from '../components'
import { expect } from 'chai'
import { copy, no, yes } from '../util'

const basicSchemaObject: SchemaObject = {
  type: 'object',
  allowsSchemaExtensions: yes,
  properties: [
    { name: 'any', schema: { type: 'any' } },
    {
      name: 'array',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          allowsSchemaExtensions: no,
          properties: [
            { name: 'x', schema: { type: 'number' } },
            { name: 'y', schema: { type: 'number' } }
          ]
        }
      }
    },
    { name: 'boolean', schema: { type: 'boolean', default: () => true } },
    { name: 'number', schema: { type: 'number' } },
    {
      name: 'object',
      schema: {
        type: 'object',
        allowsSchemaExtensions: no,
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
            condition: (data) => typeof data.definition === 'boolean',
            schema: { type: 'boolean' }
          },
          {
            condition: (data) => typeof data.definition === 'string',
            schema: { type: 'string' }
          }
        ]
      }
    },
    { name: 'string', schema: { type: 'string' } }
  ]
}

interface BasicDefinition {
  [extension: string]: any
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
  readonly any?: any
  readonly array?: Array<{ x?: number, y?: number }>
  readonly boolean!: boolean
  readonly number?: number
  readonly object?: { x?: number, y?: number }
  readonly string?: string

  constructor (definition: BasicDefinition, version?: Version) {
    const data = initializeData('constructing Basic object', definition, version, arguments[2])
    super(data)
  }

  static schemaGenerator (): SchemaObject {
    return copy(basicSchemaObject)
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
    const data = initializeData('constructing HasChildComponent object', definition, version, arguments[2])
    super(data)
  }

  static schemaGenerator (): SchemaObject {
    const schema = copy<SchemaObject>(basicSchemaObject)
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
    const data = initializeData('constructing LoopComponent object', definition, version, arguments[2])
    super(data)
  }

  static schemaGenerator (): SchemaObject {
    const schema = copy<SchemaObject>(basicSchemaObject)
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

    describe('after function', () => {
      it('is not run during build', function () {
        let count = 0
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          after () { count++ }
        })
        const t = new Test({})
        expect(t).to.be.instanceOf(Test)
        expect(count).to.equal(0)
      })
    })

    describe('before function', function () {
      it('is not run during build', function () {
        let count = 0
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          before () {
            count++
            return true
          }
        })
        const t = new Test({})
        expect(t).to.be.instanceOf(Test)
        expect(count).to.equal(0)
      })
    })

    describe('build function', function () {
      it('is run during build', function () {
        let count = 0
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          additionalProperties: {
            type: 'string',
            build () {
              count++
              return 'baz'
            }
          }
        })
        const t = new Test({ foo: 'bar' })
        expect(t).to.be.instanceOf(Test)
        expect(count).to.equal(1)
      })

      it('cannot be run on arrays', function () {
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          additionalProperties: {
            type: 'array',
            items: { type: 'any' },
            build () { return true }
          }
        })
        expect(() => new Test({ foo: [] })).to.throw(/SchemaArray does not support build function./)
      })

      it('cannot be run on objects', function () {
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          build (d) { return true }
        })
        expect(() => new Test({})).to.throw(/SchemaObject does not support build function./)
      })
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
    describe('after function', function () {
      it('is run during validate', function () {
        let count = 0
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          after () { count++ }
        })
        Test.validate({})
        expect(count).to.equal(1)
      })

      it('will not run if before function returns false', function () {
        let count = 0
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          before () { return false },
          after () { count++ }
        })
        Test.validate({})
        expect(count).to.equal(0)
      })

      it('will not run if there are errors', function () {
        let count = 0
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          after () { count++ },
          properties: [
            {
              name: 'required',
              required: yes,
              schema: { type: 'string' }
            }
          ]
        })
        const [error] = Test.validate({})
        expect(error).not.to.equal(null)
        expect(count).to.equal(0)
      })
    })

    describe('before function', function () {
      it('is run during validate', function () {
        let count = 0
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          before () {
            count++
            return true
          }
        })
        Test.validate({})
        expect(count).to.equal(1)
      })

      it('will stop all other validations from running if before returns false', function () {
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          before () { return false },
          properties: [
            {
              name: 'required',
              required: yes,
              schema: { type: 'string' }
            }
          ]
        })
        const [error] = Test.validate({})
        expect(error).to.equal(null)
      })
    })

    describe('build function', function () {
      it('is run during validate', function () {
        let data: any
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          additionalProperties: {
            type: 'string',
            build (d) {
              data = d.root
              return 'baz'
            }
          }
        })
        Test.validate({ foo: 'bar' })
        expect(data?.built.foo).to.equal('baz')
      })

      it('cannot be run on arrays', function () {
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          additionalProperties: {
            type: 'array',
            items: { type: 'any' },
            build () { return true }
          }
        })
        expect(() => Test.validate({ foo: [] })).to.throw(/SchemaArray does not support build function./)
      })

      it('cannot be run on objects', function () {
        const Test = TestComponent({
          type: 'object',
          allowsSchemaExtensions: no,
          build (d) { return true }
        })
        expect(() => Test.validate({})).to.throw(/SchemaObject does not support build function./)
      })
    })
  })

  describe('type: object', () => {
    describe('required properties', () => {
      class Test extends OASComponent {
        readonly required!: boolean

        constructor (definition: any, version?: Version) {
          const data = initializeData('constructing Test object', definition, version, arguments[2])
          super(data)
        }

        static schemaGenerator (): SchemaObject {
          return {
            type: 'object',
            allowsSchemaExtensions: no,
            properties: [
              {
                name: 'required',
                required: yes,
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
        expect(error).to.match(/Missing one or more required properties: required/)
      })
    })
  })
})

function TestComponent (schema: SchemaObject): ExtendedComponent {
  return class Test extends OASComponent {
    constructor (definition: any, version?: Version) {
      const data = initializeData('constructing Test object', definition, version, arguments[2])
      super(data)
    }

    static schemaGenerator (): SchemaObject {
      return schema
    }
  }
}
