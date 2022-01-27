import { expect } from 'chai'
import { Parameter2 as Parameter2Definition, Parameter3 as Parameter3Definition } from '../../src/components/helpers/definition-types'
import { Parameter as Parameter2 } from '../../src/components/v2/Parameter'
import { Parameter as Parameter3 } from '../../src/components/v3/Parameter'

describe('Component: Parameter', () => {
  describe('build', () => {

  })

  describe('validate', () => {

  })

  describe('parse', () => {
    describe('v3', () => {
      it('must have a schema to be parsed', () => {
        const def: Parameter3Definition = { name: 'user', in: 'cookie' }
        const [value, err] = new Parameter3(def).parse(['12345'])
        expect(value).to.equal(undefined)
        expect(err?.report.hasCode('PARAMETER_PARSE_SCHEMA_MISSING')).to.equal(true)
      })

      it('must have a value to be parsed', () => {
        const def: Parameter3Definition = { name: 'user', in: 'query', schema: { type: 'string' } }
        const [value, err] = new Parameter3(def).parse([])
        expect(value).to.equal(undefined)
        expect(err?.report.hasCode('PARAMETER_PARSE_VALUE_MISSING')).to.equal(true)
      })

      it('must have a determinable schema', () => {
        const def: Parameter3Definition = { name: 'user', in: 'query', schema: { not: { type: 'string' } } }
        const [value, err] = new Parameter3(def).parse(['foo'])
        expect(value).to.equal(undefined)
        expect(err?.report.hasCode('SCHEMA_INDETERMINATE')).to.equal(true)
      })

      it('must have a determined type', () => {
        const def: Parameter3Definition = { name: 'user', in: 'query', schema: {} }
        const [value, err] = new Parameter3(def).parse(['foo'])
        expect(value).to.equal(undefined)
        expect(err?.report.hasCode('SCHEMA_INDETERMINATE_TYPE')).to.equal(true)
      })
    })
  })
})
