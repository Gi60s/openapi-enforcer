import * as E from '../../src/components'
import { expect } from 'chai'
describe('Auto generated validator tests', () => {
  describe('Callback', () => {
    describe('v3', () => {
      const Callback = E.Callback3

      describe('spec version support', () => {
        it('does not support version 2.0', () => {
          const def = Callback.createDefinition()
          const { hasErrorByCode } = Callback.validate(def, '2.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })

        it('supports version 3.0.0', () => {
          const def = Callback.createDefinition()
          const { hasErrorByCode } = Callback.validate(def, '3.0.0')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.1', () => {
          const def = Callback.createDefinition()
          const { hasErrorByCode } = Callback.validate(def, '3.0.1')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.2', () => {
          const def = Callback.createDefinition()
          const { hasErrorByCode } = Callback.validate(def, '3.0.2')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('supports version 3.0.3', () => {
          const def = Callback.createDefinition()
          const { hasErrorByCode } = Callback.validate(def, '3.0.3')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(false)
        })

        it('does not support version X.Y.Z', () => {
          const def = Callback.createDefinition()
          // @ts-expect-error
          const { hasErrorByCode } = Callback.validate(def, 'X.Y.Z')
          expect(hasErrorByCode('COMPONENT_VERSION_MISMATCH')).to.equal(true)
        })
      })
    })
  })
})
