
export interface IContentType {
  extension: string
  quality: number
  subType: string
  type: string

  isMatch: (contentType: string | IContentType | undefined) => boolean
  toString: () => string
  toStringWithQuality: () => string
}
