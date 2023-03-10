export type ILookupLocation = ILookupLocationArray | ILookupLocationObject

export interface ILookupLocationArray {
  type: 'array'
  loc: ILocation
  items: ILocation[]
}

export interface ILookupLocationObject {
  type: 'object'
  loc: ILocation
  properties: Record<string, {
    key: ILocation
    value: ILocation
  }>
}

export interface ILocation {
  path: string // the path to traverse the object to this item
  root: ILocationRoot
  end?: IPosition
  start?: IPosition
}

export interface ILocationRoot {
  node: object
  source: string // file or server path
}

export interface IPosition {
  line: number
  column: number
  offset: number
}
