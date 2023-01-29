/* eslint-disable */
import * as E from '../../src/components'
import { expect } from 'chai'
describe('SecurityRequirement - Auto Generated Tests', () => {
  describe('v2', () => {
    const SecurityRequirement = E.SecurityRequirement2

    describe('spec version support', () => {
      it('supports version 2.0', () => {
        const def = SecurityRequirement.createDefinition()
        const es = SecurityRequirement.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version 3.0.0', () => {
        const def = SecurityRequirement.createDefinition()
        const es = SecurityRequirement.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.1', () => {
        const def = SecurityRequirement.createDefinition()
        const es = SecurityRequirement.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.2', () => {
        const def = SecurityRequirement.createDefinition()
        const es = SecurityRequirement.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version 3.0.3', () => {
        const def = SecurityRequirement.createDefinition()
        const es = SecurityRequirement.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('does not support version X.Y.Z', () => {
        const def = SecurityRequirement.createDefinition()
        // @ts-expect-error
        const es = SecurityRequirement.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })
  })

  describe('v3', () => {
    const SecurityRequirement = E.SecurityRequirement3

    describe('spec version support', () => {
      it('does not support version 2.0', () => {
        const def = SecurityRequirement.createDefinition()
        const es = SecurityRequirement.validate(def, '2.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(true)
      })

      it('supports version 3.0.0', () => {
        const def = SecurityRequirement.createDefinition()
        const es = SecurityRequirement.validate(def, '3.0.0')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.1', () => {
        const def = SecurityRequirement.createDefinition()
        const es = SecurityRequirement.validate(def, '3.0.1')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.2', () => {
        const def = SecurityRequirement.createDefinition()
        const es = SecurityRequirement.validate(def, '3.0.2')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('supports version 3.0.3', () => {
        const def = SecurityRequirement.createDefinition()
        const es = SecurityRequirement.validate(def, '3.0.3')
        expect(es.hasErrorByCode('VERSION_MISMATCH')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(false)
        expect(es.hasErrorByCode('VERSION_NOT_SUPPORTED')).to.equal(false)
      })

      it('does not support version X.Y.Z', () => {
        const def = SecurityRequirement.createDefinition()
        // @ts-expect-error
        const es = SecurityRequirement.validate(def, 'X.Y.Z')
        expect(es.hasErrorByCode('VERSION_NOT_IMPLEMENTED')).to.equal(true)
      })
    })
  })
})
