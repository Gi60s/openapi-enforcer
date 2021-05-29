import axios from 'axios'
import { Exception } from './Exception'
import jsonParser, { ArrayNode, LiteralNode, Location, ObjectNode, ValueNode } from 'json-to-ast'
import * as yamlParser from 'yaml-ast-parser'

const loaders: Loader[] = []
const lookupMap = new WeakMap<any, Lookup>()
const rxJson = /\.json$/
const rxHttp = /^https?:\/\//i
const rxYaml = /\.ya?ml$/
let fs: any

interface LineEnding {
  pos: number
  len: number
  lineLength: number
}

export type Loader = (path: string, data?: LoaderMetadata) => Promise<LoaderResult>

export type LoaderResult = LoaderMatch | LoaderMismatch

interface LoaderMatch {
  loaded: true
  content: string
  type?: 'json' | 'yaml'
}

interface LoaderMismatch {
  loaded: false
}

interface LoaderMetadata {
  callerPath?: string
  exception?: Exception
}

interface Lookup {
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

export function define (loader: Loader): void {
  loaders.unshift(loader)
}

export async function load (path: string, options?: Options, data?: LoaderMetadata): Promise<any> {
  if (options === undefined || options === null) options = {}
  if (typeof options !== 'object') throw Error('Invalid load options specified.')
  if (options.dereference === undefined) options.dereference = true

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

  throw Error('No defined loaders were able to load the path: ' + path)
}

export function lookup (node: object, key?: string | number, filter: 'key' | 'value' | 'both' = 'both'): Location | undefined {
  if (node === undefined) return
  const result = lookupMap.get(node)
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

  if (result.column === 0) {
    result.line--
    result.column = lastLine.lineLength + 1
  }

  return result
}

function processJsonAst (data: ValueNode): any {
  if (data.type === 'Array') {
    const built: any[] = []
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lookup: Lookup = { loc: data.loc!, items: [] }
    lookupMap.set(built, lookup)
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
    const lookup: Lookup = { loc: data.loc!, properties: {} }
    lookupMap.set(built, lookup)
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
    const lookup: Lookup = { loc, properties: {} }
    lookupMap.set(built, lookup)
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
    const lookup: Lookup = { loc, items: [] }
    lookupMap.set(built, lookup)
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

// add http(s) GET loader
define(async function (path) {
  if (rxHttp.test(path)) {
    const transformResponse = [(res: any) => res] // stop response body from being parsed

    return axios.get(path, { transformResponse })
      .then(res => {
        const contentType = res.headers['content-type']
        if (res.status < 200 || res.status >= 300) {
          throw Error('Unable to load resource due to unexpected response status code ' + String(res.status) + ' for URL: ' + path)
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
      })
  } else {
    return { loaded: false }
  }
})

// add file loader
define(async function (path) {
  if (fs === undefined) {
    try {
      fs = await import('fs')
    } catch (e) {
      fs = null
    }
  }
  if (fs === null || fs === undefined) {
    return { loaded: false }
  } else {
    return await new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err: any, content: string) => {
        if (err === null || err === undefined) {
          const result: LoaderMatch = {
            loaded: true,
            content
          }
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  }
})
