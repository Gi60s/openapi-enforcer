import Adapter from '../adapter'
import { expect } from 'chai'

const adapter = Adapter()

describe('adapter', () => {
  describe('path', () => {
    describe('dirname', () => {
      it('can get the dirname from a file path', function () {
        const dir = adapter.path.dirname('/foo/bar/baz')
        expect(dir).to.equal('/foo/bar')
      })

      it('can get the dirname from a url', function () {
        const dir = adapter.path.dirname('http://foo.com/bar/baz')
        expect(dir).to.equal('http://foo.com/bar')
      })

      it('can get the dirname from a url with a querystring', function () {
        const dir = adapter.path.dirname('http://foo.com/bar/baz?x=1')
        expect(dir).to.equal('http://foo.com/bar')
      })

      it('can get the dirname from a url with no path', function () {
        const dir = adapter.path.dirname('http://foo.com')
        expect(dir).to.equal('http://foo.com')
      })
    })

    describe('resolve', function () {
      it('can add to file path', function () {
        const result = adapter.path.resolve('/foo', 'bar', './baz')
        expect(result).to.equal('/foo/bar/baz')
      })

      it('can remove from file path', function () {
        const result = adapter.path.resolve('/foo/bar', '..')
        expect(result).to.equal('/foo')
      })

      it('can add and remove on file path', function () {
        const result = adapter.path.resolve('/a/b/c/d/e/f', '../..', '../x/../../foo/bar')
        expect(result).to.equal('/a/b/foo/bar')
      })

      it('can have multiple root paths on file path', () => {
        const result = adapter.path.resolve('/foo/bar', '/a/b', 'c')
        expect(result).to.equal('/a/b/c')
      })

      it('can add to url path', function () {
        const result = adapter.path.resolve('http://foo.com', 'bar', './baz')
        expect(result).to.equal('http://foo.com/bar/baz')
      })

      it('can remove from url path', function () {
        const result = adapter.path.resolve('http://foo.com/bar', '..')
        expect(result).to.equal('http://foo.com')
      })

      it('can add and remove on url path', function () {
        const result = adapter.path.resolve('http://foo.com/a/b/c/d/e/f', '../..', '../x/../../foo/bar')
        expect(result).to.equal('http://foo.com/a/b/foo/bar')
      })

      it('can have multiple root paths on url path', () => {
        const result = adapter.path.resolve('http://foo.com/bar', 'http://alpha.com/a/b', 'c')
        expect(result).to.equal('http://alpha.com/a/b/c')
      })

      it('can resolve to a file on url path', () => {
        const result = adapter.path.resolve('http://foo.com', 'a', 'b.html')
        expect(result).to.equal('http://foo.com/a/b.html')
      })
    })
  })
})
