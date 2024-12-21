import rx from '../rx'
import { IContentType } from './IContentType'

export class ContentType implements IContentType {
  extension: string
  quality: number
  subType: string
  type: string

  constructor (contentType: { extension?: string, quality?: number, subType: string, type: string }) {
    this.extension = contentType.extension?.trim() ?? ''
    this.quality = contentType.quality ?? 1
    this.subType = contentType.subType
    this.type = contentType.type
  }

  isMatch (contentType: string | ContentType | undefined): boolean {
    if (typeof contentType === 'string') contentType = ContentType.fromString(contentType)
    if (contentType === undefined) return false
    const { type, subType, extension } = contentType
    return ((this.type === type || this.type === '*' || type === '*') &&
      (this.subType === subType || this.subType === '*' || subType === '*') &&
      (this.extension === extension || this.extension === '*' || extension === '*'))
  }

  // findMatches (items: Array<string | ContentType | undefined>): ContentType[] {
  //   const contentTypes = items
  //     .map(item => {
  //       return typeof item === 'string'
  //         ? ContentType.fromString(item)
  //         : item
  //     })
  //     .filter(contentType => {
  //       if (contentType === undefined) return false
  //       const { type, subType, extension } = contentType
  //       return ((this.type === type || this.type === '*' || type === '*') &&
  //         (this.subType === subType || this.subType === '*' || subType === '*') &&
  //         (this.extension === extension || this.extension === '*' || extension === '*'))
  //     }) as ContentType[]
  //
  //   const scores: Map<ContentType, number> = new Map<ContentType, number>()
  //   contentTypes.forEach(contentType => {
  //     const { type, subType, extension } = contentType
  //     scores.set(contentType,
  //       (this.type === type ? 1 : 0) + (this.subType === subType ? 1 : 0) + (this.extension === extension ? 1 : 0))
  //   })
  //
  //   contentTypes.sort((a, b) => {
  //     if (a.quality < b.quality) return 1
  //     if (a.quality > b.quality) return -1
  //     const scoreA = scores.get(a) as number
  //     const scoreB = scores.get(b) as number
  //     if (scoreA < scoreB) return 1
  //     if (scoreA > scoreB) return -1
  //     return 0
  //   })
  //
  //   return contentTypes
  // }

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

  static isContentTypeString (contentType: string): boolean {
    const set = contentType.split(';')
    return rx.mediaType.test(set[0])
  }

  /**
   *
   * @param accepts The accepted types, including quality.
   * @param produces The possible types.
   */
  static filterProducedTypesByAccepted (accepts: string | ContentType[], produces: Array<string | ContentType>): ContentType[] {
    const acceptedTypes = typeof accepts === 'string'
      ? this.fromStringMultiple(accepts)
      : accepts.slice(0)
    sortContentTypesByQuality(acceptedTypes)

    const length = acceptedTypes.length
    if (length === 0) return []

    const producesTypes = produces?.map(ContentType.fromString).filter(v => v !== undefined) as ContentType[] ?? []
    if (acceptedTypes.length === 0) return []

    const results: Set<ContentType> = new Set<ContentType>()
    for (let i = 0; i < length; i++) {
      const type = acceptedTypes[i]
      const match = producesTypes.find(p => type.isMatch(p))
      if (match !== undefined) {
        results.add(match)
        break
      }
    }

    return Array.from(results)
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

  static fromStringMultiple (contentType: string, sortByQuality: boolean = false): ContentType[] {
    const result = contentType.split(/, */)
      .map(this.fromString)
      .filter(v => v !== undefined) as ContentType[]
    if (sortByQuality) sortContentTypesByQuality(result)
    return result
  }
}

function sortContentTypesByQuality (contentTypes: ContentType[]): void {
  contentTypes.sort((a, b) => {
    if (a.quality === b.quality) return 0
    return a.quality < b.quality ? 1 : -1
  })
}
