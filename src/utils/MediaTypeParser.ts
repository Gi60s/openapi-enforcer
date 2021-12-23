export class MediaTypeParser {
  definition: string
  parameters: Record<string, string>
  suffixes: string[]
  subtype: string
  trailer: string
  tree: string[]
  type: string

  constructor (mediaType: string) {
    this.definition = mediaType

    // pull off the type
    let remainder: string[] = mediaType.split('/')
    this.type = remainder.shift() ?? ''

    // pull off parameters
    remainder = remainder.join('/').split(';')
    this.parameters = remainder.reduce((map: Record<string, string>, curr: string, index: number) => {
      if (index !== 0) {
        const [key, value] = curr.split('=')
        map[key.toLowerCase().trim()] = value.trim()
      }
      return map
    }, {})

    // pull off the suffixes
    remainder = remainder[0].split('+')
    this.suffixes = remainder.slice(1)

    // pull off the subtype and tree
    remainder = remainder[0].split('.')
    this.subtype = remainder.pop() ?? ''
    this.tree = remainder

    this.trailer = (this.tree.length > 0 ? this.tree.join('.') + '.' : '') +
      this.subtype +
      (this.suffixes.length > 0 ? '+' + this.suffixes.join('+') : '')
  }

  findBestMatch (mediaTypes: Array<string | MediaTypeParser>): string | undefined {
    const results: Array<{ offset: number, mediaType: string }> = []
    mediaTypes.forEach(mediaType => {
      const isString = typeof mediaType === 'string'
      const m = isString ? new MediaTypeParser(mediaType) : mediaType
      const { match, offset } = compare(this, m)
      if (match) {
        results.push({ offset, mediaType: isString ? mediaType : mediaType.definition })
      }
    })

    results.sort((a, b) => {
      if (a.offset < b.offset) return -1
      if (a.offset > b.offset) return 1
      return 0
    })

    return results[0]?.mediaType
  }

  matches (mediaType: string, exact = true): boolean {
    const m = new MediaTypeParser(mediaType)
    const result = compare(this, m)
    return result.match && (result.offset === 0 || !exact)
  }
}

function compare (m1: MediaTypeParser, m2: MediaTypeParser): { match: boolean, offset: number } {
  // type must always match
  if (m1.type !== m2.type && m1.type !== '*' && m2.type !== '*') return { match: false, offset: 0 }

  // trailer can match
  if (m1.trailer === m2.trailer || m1.trailer === '*' || m2.trailer === '*') return { match: true, offset: 0 }

  const targetSubtype = m1.trailer
  const matchSubtype = m2.trailer
  if (targetSubtype.endsWith(matchSubtype)) {
    return {
      match: true,
      offset: m1.suffixes.length + 1 - matchSubtype.split('+').length
    }
  }

  return { match: false, offset: 0 }
}
