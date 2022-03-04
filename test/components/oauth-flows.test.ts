import { OAuthFlows } from '../../src/v3'
import { expect } from 'chai'

describe('Component: OAuthFlows', () => {
  describe('build', () => {
    it('can build', () => {
      const oauthFlows = new OAuthFlows({})
      expect(oauthFlows).to.be.instanceOf(OAuthFlows)
    })
  })

  describe('validate', () => {
    // NOTE: many tests related to oauth-flows is in the oauth-flow test because they require each other
    it('has no required properties', function () {
      const [error] = OAuthFlows.validate({})
      expect(error).to.equal(undefined)
    })

    it('allows extensions', () => {
      const [, warn] = OAuthFlows.validate({ 'x-foo': 'foo' })
      expect(warn).to.equal(undefined)
    })

    it('cannot have invalid properties', function () {
      const [error] = OAuthFlows.validate({
        // @ts-expect-error
        foo: 'invalid'
      })
      expect(error).to.match(/Property "foo" not allowed. Property not part of the specification/)
    })
  })
})
