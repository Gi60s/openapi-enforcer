import { ArrayNode, LiteralNode, ObjectNode } from 'json-to-ast'
import { ExceptionStore } from '../Exception/ExceptionStore'

export interface ILineEnding {
  pos: number
  len: number
  lineLength: number
}

export interface ILoader {
  name: string
  loader: ILoaderFunction
}

export type ILoaderFunction = (path: string, data?: ILoaderMetadata) => Promise<ILoaderResult>

export type ILoaderResult = ILoaderMismatch | ILoaderMatch

export interface ILoaderMatch {
  loaded: true
  content: string
  type?: 'json' | 'yaml'
}

export interface ILoaderMismatch {
  loaded: false
  reason: string
}

export interface ILoaderMetadata {
  cache: Record<string, any>
  exceptionStore: ExceptionStore
  root: ILoaderRootData
}

export interface ILoaderRootData {
  node: object
  source: string
}

export type INode = INodeArray | INodeLiteral | INodeObject

export interface INodeArray extends ArrayNode {
  built: any
}

export interface INodeLiteral extends LiteralNode {
  built: any
}

export interface INodeObject extends ObjectNode {
  built: any
}

export interface ILoaderOptions {
  dereference: boolean
}

export interface IReference {
  key: string
  parent: any
  ref: string
}
