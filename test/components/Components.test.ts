import { expect } from 'chai'
import { Components3 } from '../../src/components'

describe('Components', () => {
  describe('Components3', () => [
    describe('component names', () => {
      it('can be a valid component name', () => {
        const es = Components3.validate({
          schemas: {
            'my-._Schema': { type: 'string' }
          }
        })
        expect(es.hasErrorByCode('COMPONENT_NAME_INVALID')).to.equal(false)
      })

      it('must be a valid component name', () => {
        const es = Components3.validate({
          schemas: {
            '%': { type: 'string' }
          }
        })
        expect(es.hasErrorByCode('COMPONENT_NAME_INVALID')).to.equal(true)
      })
    })
  ])
})
