import '../src/Adapter/index.node'
import { expect } from 'chai'
import { ExceptionStore } from '../src/Exception/ExceptionStore'
import { saveObjectLocationData } from '../src/Loader/Loader'
import { getLocation } from '../src/Locator/Locator'

describe('exceptions', () => {
  it('can create an exception store instance', () => {
    const store = new ExceptionStore()
    expect(store).to.be.instanceof(ExceptionStore)
  })

  it('can add an exception', () => {
    const store = new ExceptionStore()
    store.add({
      id: 'foo-not-a-boolean',
      code: 'VALUE_TYPE_INVALID',
      level: 'error',
      locations: []
    })
    expect(store.exceptions.length).to.equal(1)
  })

  it('can generate a report', () => {
    const node: any = { foo: 5 }
    saveObjectLocationData(node)
    const store = new ExceptionStore()
    store.add({
      id: 'X',
      code: 'VALUE_TYPE_INVALID',
      level: 'error',
      locations: [getLocation(node, 'foo')],
      metadata: { value: 'foo', expectedType: 'boolean' }
    })
    expect(store.error).not.to.equal(undefined)
    expect(store.warning).to.equal(undefined)
    expect(store.info).to.equal(undefined)
    expect(store.ignored).to.equal(undefined)

    expect(store.error?.reportItems.length).to.equal(1)
    const reportItem = store.error?.reportItems[0]
    expect(reportItem?.breadcrumbs.length).to.equal(1)
    expect(reportItem?.exceptions.length).to.equal(1)

    const lines = store.error?.toString().split(/\r\n|\r|\n/) ?? []
    expect(lines[1]).to.equal('  at: foo')
    expect(lines[2]).to.equal('    [X_VALUE_TYPE_INVALID] The value "foo" did not match the expected data type: "boolean".')
    expect(lines.length).to.equal(3)
  })

  it('will group two exceptions at one location', () => {
    const store = new ExceptionStore()
    const node = { foo: 5 }
    saveObjectLocationData(node)
    store.add({
      id: 'X',
      code: 'VALUE_TYPE_INVALID',
      level: 'error',
      locations: [getLocation(node, 'foo', 'value')],
      metadata: { value: 'foo', expectedType: 'boolean' }
    })
    store.add({
      id: 'X',
      code: 'URL_INVALID',
      level: 'error',
      locations: [getLocation(node, 'foo', 'value')],
      metadata: { url: 'hello' }
    })
    expect(store.error?.reportItems.length).to.equal(1)
    const reportItem = store.error?.reportItems[0]
    expect(reportItem?.breadcrumbs.length).to.equal(1)
    expect(reportItem?.exceptions.length).to.equal(2)

    const lines = store.error?.toString().split(/\r\n|\r|\n/) ?? []
    expect(lines[1]).to.equal('  at: foo')
    expect(lines[2]).to.equal('    [X_VALUE_TYPE_INVALID] The value "foo" did not match the expected data type: "boolean".')
    expect(lines[3]).to.equal('    [X_URL_INVALID] URL appears to be invalid: "hello".')
    expect(lines.length).to.equal(4)
  })

  it('will group one exception at two locations', () => {
    const store = new ExceptionStore()
    const node = { foo: 5, bar: 6 }
    saveObjectLocationData(node)
    store.add({
      id: 'X',
      code: 'VALUE_TYPE_INVALID',
      level: 'error',
      locations: [
        getLocation(node, 'foo', 'value'),
        getLocation(node, 'bar', 'value')
      ],
      metadata: { value: 'foo', expectedType: 'boolean' }
    })
    expect(store.error?.reportItems.length).to.equal(1)
    const reportItem = store.error?.reportItems[0]
    expect(reportItem?.breadcrumbs.length).to.equal(2)
    expect(reportItem?.exceptions.length).to.equal(1)

    const lines = store.error?.toString().split(/\r\n|\r|\n/) ?? []
    expect(lines.length).to.equal(5)
    expect(lines[1]).to.equal('  at 2 locations:')
    expect(lines[2]).to.equal('    1. bar')
    expect(lines[3]).to.equal('    2. foo')
    expect(lines[4]).to.equal('      [X_VALUE_TYPE_INVALID] The value "foo" did not match the expected data type: "boolean".')
  })
})