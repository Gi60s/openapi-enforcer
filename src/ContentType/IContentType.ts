
export interface IContentType {
  extension: string
  quality: number
  subType: string
  type: string

  findMatches: (items: Array<string | IContentType | undefined>) => IContentType[]
  toString: () => string
  toStringWithQuality: () => string
}
