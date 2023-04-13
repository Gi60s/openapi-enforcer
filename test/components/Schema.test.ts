import { Schema2, Schema3 } from '../../src/components'
import { expect } from 'chai'

describe('Schema', () => {
  describe('Schema2', () => {
    describe('definition', () => {
      it('allows a valid schema', () => {
        const result = Schema2.validate({ type: 'string' })
        expect(result.hasError).to.equal(false)
      })

      describe('property: type', () => {
        it('will warn if schema type is indeterminate', () => {
          const result = Schema2.validate({})
          expect(result.hasWarningByCode('SCHEMA_TYPE_INDETERMINATE')).to.equal(true)
        })

        it('requires a valid type', () => {
          const result = Schema2.validate({ type: 'foo' })
          expect(result.hasErrorByCode('SCHEMA_TYPE_INVALID')).to.equal(true)
        })

        it('allows top level schema to be of type "file" for v2', () => {
          const result = Schema2.validate({ type: 'file' })
          expect(result.hasErrorByCode('SCHEMA_TYPE_INVALID')).to.be.equal(false)
          expect(result.hasErrorByCode('SCHEMA_TYPE_INVALID_FILE')).to.be.equal(false)
        })

        it('does not allow nested schema to be of type "file" for nested schema', () => {
          const result = Schema2.validate({
            type: 'object',
            properties: {
              file: { type: 'file' }
            }
          })
          expect(result.hasErrorByCode('SCHEMA_TYPE_INVALID')).to.be.equal(false)
          expect(result.hasErrorByCode('SCHEMA_TYPE_INVALID_FILE')).to.be.equal(true)
        })
      })
    })
  })
})
