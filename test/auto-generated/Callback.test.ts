/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('Callback - Auto Generated Tests', () => {
  describe('v3', () => {
    const Callback = E.Callback3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = Callback.createDefinition()
        const es = Callback.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = Callback.createDefinition()
        const es = Callback.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = Callback.createDefinition()
        const es = Callback.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = Callback.createDefinition()
        const es = Callback.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = Callback.createDefinition()
        const es = Callback.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = Callback.createDefinition()
        // @ts-expect-error
        const es = Callback.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })
  })
})
