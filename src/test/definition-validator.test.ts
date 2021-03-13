/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai'
import { Exception } from 'exception-tree'
import { SchemaObject, ValidatorFactory } from '../definition-validator'
import { EnforcerComponent, ExtensionData } from '../components'

describe.only('definition validator', () => {
  describe('common', function () {
    describe('after', function () {
      it('will have a built object', function () {
        let built
        const C = define(() => {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            after (data) {
              built = data.built
            }
          }
        })
        C.validate({})
        expect(built).to.deep.equal({})
      })

      it('can add errors and warnings', function () {
        const C = define(() => {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            after ({ error, warning }) {
              error.message('foo')
              warning.message('bar')
            }
          }
        })
        const [value, error, warning] = C.validate({})
        expect(value).to.be.undefined
        expect(error).to.match(/foo/)
        expect(warning).to.match(/bar/)
      })
    })

    describe('allowed', function () {
      it('schema can be explicitly allowed', function () {
        const C = define(() => {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            properties: [
              {
                name: 'foo',
                allowed: () => true,
                schema: {
                  type: 'string'
                }
              }
            ]
          }
        })

        const [value, error, warning] = C.validate({ foo: 'bar' })
        expect(value).to.deep.equal({ foo: 'bar' })
        expect(error).to.be.undefined
        expect(warning).to.be.undefined
      })

      it('schema can be explicitly disallowed', function () {
        const C = define(() => {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            properties: [
              {
                name: 'foo',
                allowed: () => false,
                schema: {
                  type: 'string'
                }
              }
            ]
          }
        })

        const [value, error, warning] = C.validate({ foo: 'bar' })
        expect(value).to.be.undefined
        expect(error).to.match(/properties exist that are not allowed: foo/)
        expect(warning).to.be.undefined
      })
    })

    describe('before', function () {
      it('will not have a built object', function () {
        let built
        const C = define(() => {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            before (data) {
              built = data.built
              return true
            }
          }
        })
        C.validate({ foo: 1 })
        expect(built).to.be.undefined
      })

      it('will continue validating if before returns true', function () {
        const C = define(() => {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            before () { return true },
            properties: [
              { name: 'foo', schema: { type: 'string' } }
            ]
          }
        })
        const [value, error, warning] = C.validate({ foo: 1 })
        expect(value).to.be.undefined
        expect(error).to.match(/Expected a string/)
        expect(warning).to.be.undefined
      })

      it('will not continue validating if before returns false', function () {
        const C = define(() => {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            before () { return false },
            properties: [
              { name: 'foo', schema: { type: 'string' } }
            ]
          }
        })
        const [value, error, warning] = C.validate({ foo: 1 })
        expect(value).to.be.undefined
        expect(error).to.be.undefined
        expect(warning).to.be.undefined
      })

      it('can add errors and warnings', function () {
        const C = define(() => {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            before ({ error, warning }) {
              error.message('foo')
              warning.message('bar')
              return true
            }
          }
        })
        const [value, error, warning] = C.validate({ foo: 1 })
        expect(value).to.be.undefined
        expect(error).to.match(/foo/)
        expect(warning).to.match(/bar/)
      })
    })

    describe('default', function () {
      it('will set default if value not provided', function () {
        const C = define(() => {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            properties: [
              {
                name: 'foo',
                schema: {
                  type: 'string',
                  default () { return 'foo' }
                }
              }
            ]
          }
        })
        const [value, error, warning] = C.validate({})
        expect(value).to.deep.equal({ foo: 'foo' })
        expect(error).to.be.undefined
        expect(warning).to.be.undefined
      })

      it('will not set default if value is provided', function () {
        const C = define(() => {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            properties: [
              {
                name: 'foo',
                schema: {
                  type: 'string',
                  default () { return 'foo' }
                }
              }
            ]
          }
        })
        const [value, error, warning] = C.validate({ foo: 'bar' })
        expect(value).to.deep.equal({ foo: 'bar' })
        expect(error).to.be.undefined
        expect(warning).to.be.undefined
      })

      it('will not alter definition input', function () {
        const C = define(() => {
          return {
            type: 'object',
            allowsSchemaExtensions: false,
            properties: [
              {
                name: 'foo',
                schema: {
                  type: 'string',
                  default () { return 'foo' }
                }
              }
            ]
          }
        })
        const def = {}
        const [value] = C.validate(def)
        expect(value).to.deep.equal({ foo: 'foo' })
        expect(value).not.to.equal(def)
        expect(def).to.deep.equal({})
      })
    })

    describe('enum', function () {
      it('will allow value matching enum', function () {
        const C = define('C', {
          type: 'object',
          properties: [
            {
              name: 'foo',
              schema: {
                type: 'string',
                enum: () => ['foo', 'bar']
              }
            }
          ]
        })
        const [value, error, warning] = C.validate({ foo: 'bar' })
        expect(value).to.deep.equal({ foo: 'bar' })
        expect(error).to.be.undefined
        expect(warning).to.be.undefined
      })

      it('will not allow a value not-matching enum', function () {
        const C = define('C', {
          type: 'object',
          properties: [
            {
              name: 'foo',
              schema: {
                type: 'string',
                enum: () => ['foo', 'bar']
              }
            }
          ]
        })
        const [value, error, warning] = C.validate({ foo: 'baz' })
        expect(value).to.be.undefined
        expect(error).to.match(/must be one of: foo, bar/)
        expect(warning).to.be.undefined
      })
    })

    describe('ignored', function () {
      it('can explicitly ignore value', function () {
        const C = define('C', {
          type: 'object',
          properties: [
            {
              name: 'foo',
              schema: {
                type: 'string',
                ignored: () => true
              }
            }
          ]
        })
        const [value, error, warning] = C.validate({ foo: 1 })
        expect(value).to.deep.equal({})
        expect(error).to.be.undefined
        expect(warning).to.be.undefined
      })

      it('can explicitly not ignore value', function () {
        const C = define('C', {
          type: 'object',
          properties: [
            {
              name: 'foo',
              schema: {
                type: 'string',
                ignored: () => false
              }
            }
          ]
        })
        const [value, error, warning] = C.validate({ foo: 'bar' })
        expect(value).to.deep.equal({ foo: 'bar' })
        expect(error).to.be.undefined
        expect(warning).to.be.undefined
      })
    })

    describe('nullable', function () {
      it('can be explicitly nullable', function () {
        const C = define('C', {
          type: 'object',
          properties: [
            {
              name: 'foo',
              schema: {
                type: 'string',
                nullable: () => true
              }
            }
          ]
        })
        const [value, error, warning] = C.validate({ foo: null })
        expect(value).to.deep.equal({ foo: null })
        expect(error).to.be.undefined
        expect(warning).to.be.undefined
      })

      it('can be explicitly not nullable', function () {
        const C = define('C', {
          type: 'object',
          properties: [
            {
              name: 'foo',
              schema: {
                type: 'string',
                nullable: () => false
              }
            }
          ]
        })
        const [value, error, warning] = C.validate({ foo: null })
        expect(value).to.be.undefined
        expect(error).to.match(/must not be null/)
        expect(warning).to.be.undefined
      })

      it('is nullable by default', function () {
        const C = define('C', {
          type: 'object',
          properties: [
            {
              name: 'foo',
              schema: {
                type: 'string'
              }
            }
          ]
        })
        const [value, error, warning] = C.validate({ foo: null })
        expect(value).to.be.undefined
        expect(error).to.match(/must not be null/)
        expect(warning).to.be.undefined
      })
    })
  })

  describe('array', function () {
    it('will validate type', function () {
      const C = define('C', {
        type: 'object',
        properties: [
          {
            name: 'foo',
            schema: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        ]
      })
      const [value, error, warning] = C.validate({ foo: 'a' })
      expect(value).to.be.undefined
      expect(error).to.match(/Expected an array/)
      expect(warning).to.be.undefined
    })

    it('will validate all items', function () {
      const C = define('C', {
        type: 'object',
        properties: [
          {
            name: 'foo',
            schema: {
              type: 'array',
              items: {
                type: 'string',
                enum: () => ['a', 'b']
              }
            }
          }
        ]
      })
      const [value, error, warning] = C.validate({ foo: ['a', 'b', 'c'] })
      expect(value).to.be.undefined
      expect(error).to.match(/must be one of: a, b/)
      expect(warning).to.be.undefined
    })
  })

  describe('boolean', function () {
    it('will validate type', function () {
      const C = define('C', {
        type: 'object',
        properties: [
          {
            name: 'foo',
            schema: {
              type: 'boolean'
            }
          }
        ]
      })
      const [, error] = C.validate({ foo: 'a' })
      expect(error).to.match(/Expected a boolean/)

      const [value] = C.validate({ foo: true })
      expect(value).to.deep.equal({ foo: true })
    })
  })

  describe('number', function () {
    it('will validate type', function () {
      const C = define('C', {
        type: 'object',
        properties: [
          {
            name: 'foo',
            schema: {
              type: 'number'
            }
          }
        ]
      })
      const [, error] = C.validate({ foo: 'a' })
      expect(error).to.match(/Expected a number/)

      const [value] = C.validate({ foo: 1 })
      expect(value).to.deep.equal({ foo: 1 })
    })
  })

  describe('string', function () {
    it('will validate type', function () {
      const C = define('C', {
        type: 'object',
        properties: [
          {
            name: 'foo',
            schema: {
              type: 'string'
            }
          }
        ]
      })
      const [, error] = C.validate({ foo: 1 })
      expect(error).to.match(/Expected a string/)

      const [value] = C.validate({ foo: 'a' })
      expect(value).to.deep.equal({ foo: 'a' })
    })
  })

  describe('object', function () {
    describe('additionalProperties', function () {
      it('defaults to false', function () {
        const C = define('C', {
          type: 'object'
        })
        const [value, error, warning] = C.validate({ foo: 1 })
        expect(value).to.be.undefined
        expect(error).to.match(/properties exist that are not allowed: foo/)
        expect(warning).to.be.undefined
      })

      it('can be set to false', function () {
        const C = define('C', {
          type: 'object',
          additionalProperties: false
        })
        const [value, error, warning] = C.validate({ foo: 1 })
        expect(value).to.be.undefined
        expect(error).to.match(/properties exist that are not allowed: foo/)
        expect(warning).to.be.undefined
      })

      it('can be set to true', function () {
        const C = define('C', {
          type: 'object',
          additionalProperties: true
        })
        const [value, error, warning] = C.validate({ foo: 1 })
        expect(value).to.deep.equal({ foo: 1 })
        expect(error).to.be.undefined
        expect(warning).to.be.undefined
      })

      it('can be set to a schema', function () {
        const C = define('C', {
          type: 'object',
          additionalProperties: {
            type: 'string'
          }
        })
        const [, error] = C.validate({ foo: 1 })
        expect(error).to.match(/Expected a string/)

        const [value] = C.validate({ foo: 'a' })
        expect(value).to.deep.equal({ foo: 'a' })
      })
    })

    describe('required', function () {
      it('can require an additional property', function () {
        const C = define('C', {
          type: 'object',
          required: () => ['foo'],
          additionalProperties: true
        })
        const [, error] = C.validate({ bar: 1 })
        expect(error).to.match(/Missing one or more required properties: foo/)

        const [value] = C.validate({ foo: 'a' })
        expect(value).to.deep.equal({ foo: 'a' })
      })

      it('can require a named property', function () {
        const C = define('C', {
          type: 'object',
          required: () => ['foo'],
          properties: [
            {
              name: 'foo',
              schema: { type: 'string' }
            }
          ]
        })
        const [, error] = C.validate({ bar: 1 })
        expect(error).to.match(/Missing one or more required properties: foo/)

        const [value] = C.validate({ foo: 'a' })
        expect(value).to.deep.equal({ foo: 'a' })
      })
    })

    describe('component', function () {
      it('can validate sub components', function () {
        const components = {}
        const A = define('A', {
          type: 'object',
          properties: [
            {
              name: 's',
              schema: { type: 'string' }
            }
          ]
        }, components)

        const B = define('B', {
          type: 'object',
          properties: [
            {
              name: 'a',
              schema: {
                type: 'component',
                // @ts-expect-error
                component: A
              }
            }
          ]
        }, components)

        const [value] = B.validate({ a: { s: 'hello' } })
        expect(value).to.deep.equal({ a: { s: 'hello' } })

        const [, error] = B.validate({ a: { s: 1 } })
        expect(error).to.match(/Expected a string. Received: 1/)
      })
    })
  })

  describe('extensions', function () {
    it('will run extensions', function () {
      const C = define('C', {
        type: 'object',
        properties: [
          {
            name: 's',
            schema: { type: 'string' }
          }
        ]
      })
      C.extend('validator', (data: ExtensionData<any, any>) => {
        data.warning.message('This is a warning')
      })

      const [, , warning] = C.validate({ s: 'hello' })
      expect((warning as Exception).count).to.equal(1)
      expect(warning).to.match(/This is a warning/)
    })

    it('will run sub component extensions', function () {
      const components = {}
      const A = define('A', {
        type: 'object',
        properties: [
          {
            name: 's',
            schema: { type: 'string' }
          }
        ]
      }, components)
      A.extend('validator', (data: ExtensionData<any, any>) => {
        data.warning.message('This is a warning')
      })

      const B = define('B', {
        type: 'object',
        properties: [
          {
            name: 'a',
            schema: {
              type: 'component',
              // @ts-expect-error
              component: A
            }
          }
        ]
      }, components)

      const [, , warning] = B.validate({ a: { s: 'hello' } })
      expect((warning as Exception).count).to.equal(1)
      expect(warning).to.match(/This is a warning/)
    })
  })
})

function define<Definition, Built> (validator: ValidatorFactory<Definition, Built>): EnforcerComponent<Definition, Built> {
  class Test extends EnforcerComponent<Definition, Built> {
    readonly [x: string]: any

    // constructor (definition: Definition) {
    //   super(definition)
    // }

    public static get validator () {
      return validator
    }

    public static get versions () {
      return versions
    }
  }

  return Test
}
