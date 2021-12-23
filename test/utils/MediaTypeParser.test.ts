import { expect } from 'chai'
import { MediaTypeParser } from '../../src/utils/MediaTypeParser'

describe.only('MediaTypeParser', () => {
  describe('parse', () => {
    it('can parse application/javascript', () => {
      const m = new MediaTypeParser('application/javascript')
      expect(m.parameters).to.deep.equal({})
      expect(m.suffixes).to.deep.equal([])
      expect(m.subtype).to.equal('javascript')
      expect(m.tree).to.deep.equal([])
      expect(m.type).to.equal('application')
    })

    it('can parse application/json', () => {
      const m = new MediaTypeParser('application/json')
      expect(m.parameters).to.deep.equal({})
      expect(m.suffixes).to.deep.equal([])
      expect(m.subtype).to.equal('json')
      expect(m.tree).to.deep.equal([])
      expect(m.type).to.equal('application')
    })

    it('can parse application/ld+json', () => {
      const m = new MediaTypeParser('application/ld+json')
      expect(m.parameters).to.deep.equal({})
      expect(m.suffixes).to.deep.equal(['json'])
      expect(m.subtype).to.equal('ld')
      expect(m.tree).to.deep.equal([])
      expect(m.type).to.equal('application')
    })

    it('can parse application/did+ld+json', () => {
      const m = new MediaTypeParser('application/did+ld+json')
      expect(m.parameters).to.deep.equal({})
      expect(m.suffixes).to.deep.equal(['ld', 'json'])
      expect(m.subtype).to.equal('did')
      expect(m.tree).to.deep.equal([])
      expect(m.type).to.equal('application')
    })

    it('can parse application/vnd.api+json', () => {
      const m = new MediaTypeParser('application/vnd.api+json')
      expect(m.parameters).to.deep.equal({})
      expect(m.suffixes).to.deep.equal(['json'])
      expect(m.subtype).to.equal('api')
      expect(m.tree).to.deep.equal(['vnd'])
      expect(m.type).to.equal('application')
    })

    it('can parse application/vnd.oasis.opendocument.text', () => {
      const m = new MediaTypeParser('application/vnd.oasis.opendocument.text')
      expect(m.parameters).to.deep.equal({})
      expect(m.suffixes).to.deep.equal([])
      expect(m.subtype).to.equal('text')
      expect(m.tree).to.deep.equal(['vnd', 'oasis', 'opendocument'])
      expect(m.type).to.equal('application')
    })

    it('can parse text/html; Charset=UTF-8', () => {
      const m = new MediaTypeParser('text/html; Charset=UTF-8')
      expect(m.parameters).to.deep.equal({ charset: 'UTF-8' })
      expect(m.suffixes).to.deep.equal([])
      expect(m.subtype).to.equal('html')
      expect(m.tree).to.deep.equal([])
      expect(m.type).to.equal('text')
    })

    it('can parse text/vnd.a.b.plain+foo+bar; Charset=UTF-8; foo=bar', () => {
      const m = new MediaTypeParser('text/vnd.a.b.plain+foo+bar; Charset=UTF-8; foo=bar')
      expect(m.parameters).to.deep.equal({ charset: 'UTF-8', foo: 'bar' })
      expect(m.suffixes).to.deep.equal(['foo', 'bar'])
      expect(m.subtype).to.equal('plain')
      expect(m.tree).to.deep.equal(['vnd', 'a', 'b'])
      expect(m.type).to.equal('text')
    })
  })

  describe('findBestMatch', () => {
    it('will use exact match first', () => {
      const m = new MediaTypeParser('application/did+ld+json')
      const best = m.findBestMatch([
        'application/ld+json',
        'application/did+ld+json',
        'application/json',
        'application/ld+foo'
      ])
      expect(best).to.equal('application/did+ld+json')
    })

    it('will use longest suffix match 1 ', () => {
      const m = new MediaTypeParser('application/did+ld+json')
      const best = m.findBestMatch([
        'application/ld+json',
        'application/ld+foo',
        'application/json'
      ])
      expect(best).to.equal('application/ld+json')
    })

    it('will use longest suffix match 2', () => {
      const m = new MediaTypeParser('application/did+ld+json')
      const best = m.findBestMatch([
        'application/did+json',
        'application/ld+foo',
        'application/json'
      ])
      expect(best).to.equal('application/json')
    })

    it('will return undefined if no match', () => {
      const m = new MediaTypeParser('application/did+ld+json')
      const best = m.findBestMatch([
        'application/did+ld',
        'application/ld+foo',
        'application/ld'
      ])
      expect(best).to.equal(undefined)
    })
  })

  describe('matches', () => {
    it('matches application/json to application/json', () => {
      const m = new MediaTypeParser('application/json')
      expect(m.matches('application/json')).to.equal(true)
    })

    it('matches application/ld+json to application/json when exact is not required', () => {
      const m = new MediaTypeParser('application/ld+json')
      expect(m.matches('application/json', false)).to.equal(true)
    })

    it('does not match application/ld+json to application/json when exact is required', () => {
      const m = new MediaTypeParser('application/json')
      expect(m.matches('application/ld+json')).to.equal(false)
    })

    it('does not match application/json to application/ld+json even when exact is not required', () => {
      const m = new MediaTypeParser('application/ld')
      expect(m.matches('application/ld+json', false)).to.equal(false)
    })

    it('matches application/did+ld+json to application/json when exact is not required', () => {
      const m = new MediaTypeParser('application/did+ld+json')
      expect(m.matches('application/json', false)).to.equal(true)
    })

    it('matches application/vnd.foo to application/vnd.foo', () => {
      const m = new MediaTypeParser('application/vnd.foo')
      expect(m.matches('application/vnd.foo')).to.equal(true)
    })

    it('matches application/vnd.foo+json to application/json when exact is not required', () => {
      const m = new MediaTypeParser('application/vnd.foo+json')
      expect(m.matches('application/json', false)).to.equal(true)
    })
  })
})
