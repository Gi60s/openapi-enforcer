import axios from 'axios'
import { Exception } from './Exception'
import * as E from './Exception/methods'
import jsonParser, { ArrayNode, LiteralNode, Location, ObjectNode, ValueNode } from 'json-to-ast'
import * as yamlParser from 'yaml-ast-parser'
import { Result as ResultObject } from './Result'
import * as util from './util'
import Adapter from './adapter'

const adapter = Adapter()
const loaders: Loader[] = []
const lookupLocationMap = new WeakMap<any, LookupLocation>()
const rxJson = /\.json$/
const rxHttp = /^https?:\/\//i
const rxYaml = /\.ya?ml$/
let fs: any

interface LineEnding {
  pos: number
  len: number
  lineLength: number
}

export type Loader = (path: string, data?: LoaderMetadata) => Promise<Result>

export type Result = LoaderMismatch | LoaderMatch

interface LoaderMatch {
  loaded: true
  content: string
  type?: 'json' | 'yaml'
}

interface LoaderMismatch {
  loaded: false
}

export interface LoaderMetadata {
  callerPath?: string
  cache?: Record<string, any>
  exception?: Exception
}

interface LookupLocation {
  loc: Location
  items?: Location[]
  properties?: Record<string, { key: Location, value: Location }>
}

type Node = NodeArray | NodeLiteral | NodeObject

interface NodeArray extends ArrayNode {
  built: any
}

interface NodeLiteral extends LiteralNode {
  built: any
}

interface NodeObject extends ObjectNode {
  built: any
}

export interface Options {
  dereference?: boolean
}

interface Reference {
  key: string
  parent: any
  ref: string
}

export function define (loader: Loader): void {
  loaders.unshift(loader)
}

// using a load cache, look up a node by its path
export function getReferenceNode (loadMap: Record<string, any>, rootNodePath: string, ref: string, exception: Exception): void {
  const rootNode = loadMap[rootNodePath]
  if (rootNode === undefined) {
    const message = E.loaderPathNotCached(rootNodePath)
    exception.message(message)
  } else {
    if (ref.startsWith('#/')) {
      return traverse(rootNode, ref, rootNodePath, exception)
    } else {
      const dirPath = adapter.path.dirname(rootNodePath)
      let [childPath, subRef] = ref.split('#/')
      childPath = adapter.path.resolve(dirPath, childPath)
      const node = loadMap[childPath]
      if (node === undefined) {
        const message = E.loaderPathNotCached(childPath)
        exception.message(message)
      } else if (subRef === undefined) {
        return node
      } else {
        return traverse(node, '#/' + subRef, childPath, exception)
      }
    }
  }
}

export async function load (path: string, options?: Options, data?: LoaderMetadata): Promise<ResultObject> {
  if (options === undefined || options === null) options = {}
  if (typeof options !== 'object') throw Error('Invalid load options specified.')
  if (options.dereference === undefined) options.dereference = true

  if (data === undefined || data === null) data = {}
  if (data.exception === undefined) data.exception = new Exception('Unable to load ' + path)
  if (data.cache === undefined) data.cache = {}

  // load content and cache it
  const node = data.cache[path] !== undefined ? data.cache[path] : await runLoaders(path, data)
  const [loaderError] = data.exception
  const hasException = loaderError !== undefined
  if (!hasException) data.cache[path] = node

  // dereference any $refs
  if (!hasException && node !== undefined && options.dereference) {
    const references = findRefs(node)
    const length = references.length
    const dirPath = adapter.path.dirname(path)
    for (let i = 0; i < length; i++) {
      const { ref, parent, key } = references[i]
      let n: any // = await dereference(node, ref, data.exception, path)

      // local reference
      if (ref.startsWith('#/')) {
        n = traverse(node, ref, path, data.exception)

      // reference to other location
      } else {
        let [childPath, subRef] = ref.split('#/')
        childPath = adapter.path.resolve(dirPath, childPath)
        const [node] = await load(childPath, options, data)
        if (subRef === undefined) {
          n = node
        } else if (node !== undefined) {
          n = traverse(node, '#/' + subRef, childPath, data.exception)
        }
      }

      if (n !== undefined) {
        // TODO: handle case where parent === null
        parent[key] = n
      } else {
        const message = E.refNotResolved(ref, path)
        util.addExceptionLocation(message, lookupLocation(node))
        data.exception.message(message)
      }
    }
  }

  return new ResultObject(node, data.exception)
}

// look up location information for a specific node
export function lookupLocation (node: object, key?: string | number, filter: 'key' | 'value' | 'both' = 'both'): Location | undefined {
  if (node === undefined) return
  const result = lookupLocationMap.get(node)
  if (result !== undefined) {
    if (key !== undefined) {
      if (result.properties !== undefined) {
        const match = result.properties[key]
        if (match !== undefined) {
          if (filter === 'both') {
            return {
              start: match.key.start,
              end: match.value.end,
              source: match.key.source
            }
          } else if (filter === 'key') {
            return match.key
          } else if (filter === 'value') {
            return match.value
          }
        }
      }
      if (result.items !== undefined) return result.items[key as number]
    } else {
      return result.loc
    }
  }
}

// find all the $ref properties within the node and its descendants
export function findRefs (node: any, parent: any = null, key: string = '', data: Reference[] = []): Reference[] {
  if (Array.isArray(node)) {
    node.forEach((n, i) => findRefs(n, node, String(i), data))
  } else if (node !== null && typeof node === 'object') {
    if (node.$ref !== undefined) {
      data.push({
        key,
        parent,
        ref: node.$ref
      })
    } else {
      Object.keys(node)
        .forEach((key: string) => {
          findRefs(node[key], node, key, data)
        })
    }
  }
  return data
}

function getLocation (pos: number, lineEndings: LineEnding[]): Location['start'] {
  const result: Location['start'] = {
    line: 1,
    column: 1,
    offset: pos
  }
  let lastLine: LineEnding = lineEndings[0]

  const length = lineEndings.length
  for (let i = 0; i < length; i++) {
    const lineEnding = lineEndings[i]
    if (lineEnding.pos > pos) {
      const prev = lineEndings[i - 1]
      result.column = prev === undefined
        ? pos + 1
        : pos - (prev.pos + prev.len) + 1
      lastLine = prev
      break
    } else {
      result.line++
    }
  }

  if (result.column <= 0) {
    result.line--
    result.column = lastLine.lineLength + 1
  }

  return result
}

async function runLoaders (path: string, data: LoaderMetadata): Promise<any> {
  const length = loaders.length
  for (let i = 0; i < length; i++) {
    const loader = loaders[i]
    const result = await loader(path, data)
    if (result.loaded) {
      // if type is not known then maybe the path can tell us
      if (result.type === undefined) {
        if (rxJson.test(path)) {
          result.type = 'json'
        } else if (rxYaml.test(path)) {
          result.type = 'yaml'
        }
      }

      // make a final attempt to determine type
      if (result.type === undefined) {
        try {
          JSON.parse(result.content)
          result.type = 'json'
        } catch (e) {
          result.type = 'yaml'
        }
      }

      if (result.type === 'json' || result.type === undefined) {
        let value: any
        if (result.type === undefined) {
          try {
            value = JSON.parse(result.content)
          } catch (e) {
            if (result.type === 'json') throw e
          }
        } else {
          value = result.content
        }

        if (value !== undefined) {
          const ast = jsonParser(result.content, { source: path })
          return processJsonAst(ast)
        }
      }

      if (result.type === 'yaml' || result.type === undefined) {
        const rx = /\r\n|\r|\n/g
        const content = result.content
        const lineEndings: LineEnding[] = []
        let linePos = 0
        let match
        while ((match = rx.exec(content)) !== null) {
          lineEndings.push({
            pos: match.index,
            len: match[0].length,
            lineLength: match.index - linePos
          })
          linePos = match.index + match[0].length
        }
        const ast = yamlParser.safeLoad(result.content)
        if (ast.errors.length > 0) throw Error('Unable to parse YAML for one or more reasons:\r  ' + ast.errors.join('\r  '))
        const parsed = processYamlAst(ast, path, lineEndings)
        return parsed.built
      }
    }
  }

  data.exception?.message(E.loaderNotAvailable(path))
}

function processJsonAst (data: ValueNode): any {
  if (data.type === 'Array') {
    const built: any[] = []
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lookup: LookupLocation = { loc: data.loc!, items: [] }
    lookupLocationMap.set(built, lookup)
    data.children.forEach(child => {
      const result = processJsonAst(child)
      built.push(result)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      lookup.items!.push(child.loc!)
      return result
    })
    return built
  } else if (data.type === 'Literal') {
    return data.value
  } else if (data.type === 'Object') {
    const built: Record<string, any> = {}
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lookup: LookupLocation = { loc: data.loc!, properties: {} }
    lookupLocationMap.set(built, lookup)
    data.children.forEach(child => {
      const propertyName = child.key.value
      built[propertyName] = processJsonAst(child.value)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      lookup.properties![propertyName] = { key: child.key.loc!, value: child.value.loc! }
    })
    return built
  }
}

function processYamlAst (data: any, source: string, lineEndings: LineEnding[]): Node {
  const loc: Location = {
    start: getLocation(data.startPosition, lineEndings),
    end: getLocation(data.endPosition, lineEndings),
    source
  }

  // object
  if (data.kind === yamlParser.Kind.MAP) {
    const built: Record<string, any> = {}
    const lookup: LookupLocation = { loc, properties: {} }
    lookupLocationMap.set(built, lookup)
    const result: NodeObject = {
      type: 'Object',
      built,
      children: data.mappings.map((o: any) => {
        const key = o.key
        const keyLoc = {
          start: getLocation(key.startPosition, lineEndings),
          end: getLocation(key.endPosition, lineEndings),
          source
        }
        const value = processYamlAst(o.value, source, lineEndings)
        built[key.value] = value.built
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        lookup.properties![key.value] = { key: keyLoc, value: value.loc! }
        return {
          type: 'Property',
          key: {
            type: 'Identifier',
            value: key.value,
            raw: key.rawValue,
            loc: {
              start: getLocation(key.startPosition, lineEndings),
              end: getLocation(key.endPosition, lineEndings),
              source
            }
          },
          value
        }
      }),
      loc
    }
    return result
  } else if (data.kind === yamlParser.Kind.SCALAR) {
    const value = 'valueObject' in data ? data.valueObject : data.value
    return {
      type: 'Literal',
      built: value,
      value: value,
      raw: data.rawValue,
      loc
    }
  } else if (data.kind === yamlParser.Kind.SEQ) {
    const built: any[] = []
    const lookup: LookupLocation = { loc, items: [] }
    lookupLocationMap.set(built, lookup)
    return {
      type: 'Array',
      built,
      children: data.items.map((o: any, index: number) => {
        const result = processYamlAst(o, source, lineEndings)
        built.push(result.built)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        lookup.items!.push(result.loc!)
        return result
      }),
      loc
    }
  } else {
    throw Error('YAML anchors and aliases are not currently supported.')
  }
}

export function traverse (node: any, path: string, fromPath: string, exception: Exception): any {
  if (path === '') return node

  const keys = path.substring(2).split('/')
  let o = node
  while (keys.length > 0) {
    const key = keys?.shift()?.replace(/~1/g, '/').replace(/~0/g, '~')
    if (key !== undefined && key !== '#') {
      if (o !== null && typeof o === 'object' && key in o) {
        o = o[key]
      } else {
        const message = E.refNotResolved('#' + path, fromPath)
        util.addExceptionLocation(message, lookupLocation(node))
        exception.message(message)
        return
      }
    }
  }
  return o
}

// add http(s) GET loader
define(async function (path, data) {
  if (!rxHttp.test(path)) {
    return { loaded: false }
  }

  try {
    const transformResponse = [(res: any) => res] // stop response body from being parsed
    const res = await axios.get(path, { transformResponse })
    const contentType = res.headers['content-type']
    if (res.status < 200 || res.status >= 300) {
      data?.exception?.message(E.loaderFailedToLoadResource(path, 'Unexpected response code: ' + String(res.status)))
      return { loaded: false }
    } else {
      const result: LoaderMatch = {
        loaded: true,
        content: res.data
      }

      if (typeof contentType === 'string') {
        if (/^application\/json/.test(contentType)) result.type = 'json'
        if (/^(?:text|application)\/(?:x-)?yaml/.test(contentType)) result.type = 'yaml'
      }
      return result
    }
  } catch (err) {
    data?.exception?.message(E.loaderFailedToLoadResource(path, 'Unexpected error: ' + (err.toString() as string)))
    return { loaded: false }
  }
})

// add file loader
define(async function (path, data) {
  if (fs === undefined) {
    try {
      fs = await import('fs')
    } catch (e) {
      fs = null
    }
  }
  if (fs === null || fs === undefined) {
    return { loaded: false }
  }
  return await new Promise((resolve) => {
    fs.readFile(path, 'utf8', (err: any, content: string) => {
      if (err === null || err === undefined) {
        const result: LoaderMatch = {
          loaded: true,
          content
        }
        resolve(result)
      } else {
        if (err.code === 'ENOENT') {
          resolve({ loaded: false })
        } else {
          data?.exception?.message(E.loaderFailedToLoadResource(path, 'File could not load' + (err.code !== undefined ? ': ' + String(err.code) : '')))
          resolve({ loaded: false })
        }
      }
    })
  })
})
