import { Example } from '../../src'
import { expect } from 'chai'

describe('Example component', () => {
  describe('build', () => {
    it('can build', () => {
      const component = new Example({})
      expect(component).to.be.instanceof(Example)
    })
  })

  describe('validate', () => {
    it('has no required properties', function () {
      const [error] = Example.validate({})
      expect(error).to.equal(undefined)
    })

    it('allows extensions', () => {
      const [, warn] = Example.validate({ 'x-foo': 'foo' })
      expect(warn).to.equal(undefined)
    })

    it('cannot have invalid properties', function () {
      const [error] = Example.validate({
        // @ts-expect-error
        foo: 'invalid'
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })

    it('properties "value" and "externalValue" must not be paired', function () {
      const [error] = Example.validate({
        externalValue: '',
        value: ''
      })
      expect(error).to.match(/Cannot have both "externalValue" and "value" properties/)
    })

    describe('property: summary', function () {
      it('can be a string', function () {
        const [error] = Example.validate({ summary: 'Bob' })
        expect(error).to.equal(undefined)
      })

      it('must be a string', function () {
        const [error] = Example.validate({
          // @ts-expect-error
          summary: 12
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: description', function () {
      it('can be a string', function () {
        const [error] = Example.validate({ description: 'Bob' })
        expect(error).to.equal(undefined)
      })

      it('must be a string', function () {
        const [error] = Example.validate({
          // @ts-expect-error
          description: 12
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: value', function () {
      it('can be a string', function () {
        const [error] = Example.validate({ value: 'Bob' })
        expect(error).to.equal(undefined)
      })

      it('can be a boolean', function () {
        const [error] = Example.validate({ value: true })
        expect(error).to.equal(undefined)
      })

      it('can be a number', function () {
        const [error] = Example.validate({ value: 1 })
        expect(error).to.equal(undefined)
      })

      it('can be an array', function () {
        const [error] = Example.validate({ value: [] })
        expect(error).to.equal(undefined)
      })

      it('can be an object', function () {
        const [error] = Example.validate({ value: {} })
        expect(error).to.equal(undefined)
      })
    })

    describe('property: externalValue', function () {
      it('can be a string', function () {
        const [error, warning] = Example.validate({ externalValue: 'http://foo.com' })
        expect(error).to.equal(undefined)
        expect(warning).to.equal(undefined)
      })

      it('must be a string', function () {
        const [error] = Example.validate({
          // @ts-expect-error
          externalValue: 12
        })
        expect(error).to.match(/Expected a string/)
      })

      it('can be a string', function () {
        const { warning } = Example.validate({ externalValue: 'not a url' })
        expect(warning).to.match(/Value does not appear to be a valid URL/)
      })
    })
  })
})
