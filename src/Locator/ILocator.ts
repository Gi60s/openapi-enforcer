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
  breadcrumbs: string
  end?: IPosition
  source?: string // file path
  start?: IPosition
}

export interface IPosition {
  line: number
  column: number
  offset: number
}
