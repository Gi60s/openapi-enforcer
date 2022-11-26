import rx from '../rx'
import { IContentType } from './IContentType'

export class ContentType {
  extension: string
  quality: number
  subType: string
  type: string

  constructor (contentType: IContentType) {
    this.extension = contentType.extension?.trim() ?? ''
    this.quality = contentType.quality ?? 1
    this.subType = contentType.subType
    this.type = contentType.type
  }

  findMatches (items: Array<string | ContentType | undefined>): ContentType[] {
    const contentTypes = items
      .map(item => {
        return typeof item === 'string'
          ? ContentType.fromString(item)
          : item
      })
      .filter(contentType => {
        if (contentType === undefined) return false
        const { type, subType, extension } = contentType
        return ((this.type === type || this.type === '*' || type === '*') &&
          (this.subType === subType || this.subType === '*' || subType === '*') &&
          (this.extension === extension || this.extension === '*' || extension === '*'))
      }) as ContentType[]

    const scores: Map<ContentType, number> = new Map<ContentType, number>()
    contentTypes.forEach(contentType => {
      const { type, subType, extension } = contentType
      scores.set(contentType,
        (this.type === type ? 1 : 0) + (this.subType === subType ? 1 : 0) + (this.extension === extension ? 1 : 0))
    })

    contentTypes.sort((a, b) => {
      if (a.quality < b.quality) return 1
      if (a.quality > b.quality) return -1
      const scoreA = scores.get(a) as number
      const scoreB = scores.get(b) as number
      if (scoreA < scoreB) return 1
      if (scoreA > scoreB) return -1
      return 0
    })

    return contentTypes
  }

  toString (): string {
    let result = this.type + '/'
    if (this.extension.length > 0) result += this.extension + '+'
    result += this.subType
    return result
  }

  toStringWithQuality (): string {
    let result = this.toString()
    if (this.quality !== 1) result += ';q=' + String(this.quality)
    return result
  }

  static fromString (contentType: string | ContentType): ContentType | undefined {
    if (typeof contentType !== 'string') return contentType
    const set = contentType.split(';')
    const match = rx.mediaType.exec(set[0])
    const q = /q=(\d(?:\.\d)?)/.exec(set[1])
    return match === null
      ? undefined
      : new ContentType({
        extension: match[2] ?? '',
        quality: +((q?.[1]) ?? 1),
        subType: match[3],
        type: match[1]
      })
  }
}
