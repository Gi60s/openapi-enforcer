import { OAuthFlow, OAuthFlows } from '../../src/v3'
import { Message } from '../../src/Exception'
import { expect } from 'chai'

describe('Component: OAuthFlow', () => {
  describe('build', () => {
    it('can build', () => {
      const oauthFlow = new OAuthFlow({
        scopes: {}
      })
      expect(oauthFlow).to.be.instanceOf(OAuthFlow)
    })
  })

  describe('validate', () => {
    it('has required properties', () => {
      // @ts-expect-error
      const [error] = OAuthFlow.validate({})
      expect(error).to.match(/Missing required property: "scopes"/)
    })

    it('allows extensions', () => {
      const [, warn] = OAuthFlow.validate({ 'x-foo': {}, scopes: {} })
      expect(warn).to.equal(undefined)
    })

    it('cannot have invalid properties', function () {
      const [error] = OAuthFlow.validate({
        // @ts-expect-error
        foo: 'invalid',
        scopes: {}
      })
      expect(error).to.match(/Property "foo" not allowed/)
    })

    it('can have a valid OAuthFlow definition', () => {
      const [error] = OAuthFlow.validate({ scopes: {} })
      expect(error).to.equal(undefined)
    })

    it('cannot have a $ref', function () {
      const [, warning] = OAuthFlow.validate({
        // @ts-expect-error
        $ref: '',
        scopes: {}
      })
      expect(warning).to.match(/Reference not allowed here/)
    })

    describe('property: authorizationUrl', () => {
      it('is required if auth type is "authorizationCode"', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('authorizationUrl')).to.equal(true)
      })

      it('is not required if auth type is "clientCredentials"', () => {
        const [error] = OAuthFlows.validate({
          clientCredentials: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('authorizationUrl')).to.equal(false)
      })

      it('is required if auth type is "implicit"', () => {
        const [error] = OAuthFlows.validate({
          implicit: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('authorizationUrl')).to.equal(true)
      })

      it('is not required if auth type is "password"', () => {
        const [error] = OAuthFlows.validate({
          password: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('authorizationUrl')).to.equal(false)
      })

      it('can be a url', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            authorizationUrl: 'http://fake.com',
            tokenUrl: 'http://fake.com',
            scopes: {}
          }
        })
        expect(error).to.equal(undefined)
      })

      it('must be a url', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            authorizationUrl: 'hello',
            tokenUrl: 'http://fake.com',
            scopes: {}
          }
        })
        expect(error).to.match(/Value does not appear to be a valid URL/)
      })

      it('must be a string', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            // @ts-expect-error
            authorizationUrl: 5,
            scopes: {}
          }
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: refreshUrl', () => {
      it('is not required if auth type is "authorizationCode"', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('refreshUrl')).to.equal(false)
      })

      it('is not required if auth type is "clientCredentials"', () => {
        const [error] = OAuthFlows.validate({
          clientCredentials: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('refreshUrl')).to.equal(false)
      })

      it('is not required if auth type is "implicit"', () => {
        const [error] = OAuthFlows.validate({
          implicit: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('refreshUrl')).to.equal(false)
      })

      it('is not required if auth type is "password"', () => {
        const [error] = OAuthFlows.validate({
          password: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('refreshUrl')).to.equal(false)
      })

      it('can be a url', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            authorizationUrl: 'http://fake.com',
            refreshUrl: 'http://fake.com',
            tokenUrl: 'http://fake.com',
            scopes: {}
          }
        })
        expect(error).to.equal(undefined)
      })

      it('must be a url', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            authorizationUrl: 'http://fake.com',
            refreshUrl: 'hello',
            tokenUrl: 'http://fake.com',
            scopes: {}
          }
        })
        expect(error).to.match(/Value does not appear to be a valid URL/)
      })

      it('must be a string', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            // @ts-expect-error
            refreshUrl: 5,
            scopes: {}
          }
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: tokenUrl', () => {
      it('is required if auth type is "authorizationCode"', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('tokenUrl')).to.equal(true)
      })

      it('is required if auth type is "clientCredentials"', () => {
        const [error] = OAuthFlows.validate({
          clientCredentials: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('tokenUrl')).to.equal(true)
      })

      it('is not required if auth type is "implicit"', () => {
        const [error] = OAuthFlows.validate({
          implicit: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('tokenUrl')).to.equal(false)
      })

      it('is required if auth type is "password"', () => {
        const [error] = OAuthFlows.validate({
          password: {
            scopes: {}
          }
        })
        const missingProperties = error?.exceptions?.find((e: Message) => e.code === 'OAE-DMIREPR')?.metadata.missingProperties ?? []
        expect(missingProperties.includes('tokenUrl')).to.equal(true)
      })

      it('can be a url', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            authorizationUrl: 'http://fake.com',
            tokenUrl: 'http://fake.com',
            scopes: {}
          }
        })
        expect(error).to.equal(undefined)
      })

      it('must be a url', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            authorizationUrl: 'http://fake.com',
            tokenUrl: 'hello',
            scopes: {}
          }
        })
        expect(error).to.match(/Value does not appear to be a valid URL/)
      })

      it('must be a string', () => {
        const [error] = OAuthFlows.validate({
          authorizationCode: {
            // @ts-expect-error
            tokenUrl: 5,
            scopes: {}
          }
        })
        expect(error).to.match(/Expected a string/)
      })
    })

    describe('property: scopes', () => {
      it('is required', () => {
        // @ts-expect-error
        const [error] = OAuthFlow.validate({})
        expect(error).to.match(/Missing required property: "scopes"/)
      })

      it('can be an empty object', () => {
        const [error] = OAuthFlow.validate({
          scopes: {}
        })
        expect(error).to.equal(undefined)
      })

      it('can be a populated object', () => {
        const [error] = OAuthFlow.validate({
          scopes: {
            a: ''
          }
        })
        expect(error).to.equal(undefined)
      })

      it('cannot be null', () => {
        const [error] = OAuthFlow.validate({
          // @ts-expect-error
          scopes: null
        })
        expect(error).to.match(/Value must not be null/)
      })

      it('must be an object', () => {
        const [error] = OAuthFlow.validate({
          // @ts-expect-error
          scopes: 5
        })
        expect(error).to.match(/Expected a non-null object/)
      })
    })
  })
})
