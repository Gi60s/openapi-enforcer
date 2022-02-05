import { OAuthFlow } from '../../src/v3'
import { expect } from 'chai'

describe('Component: OAuthFlow', () => {
  describe('build', () => {
    it('can build', () => {
      const oauthFlow = new OAuthFlow({})
      expect(oauthFlow).to.be.instanceOf(OAuthFlow)
    })
  })
})
