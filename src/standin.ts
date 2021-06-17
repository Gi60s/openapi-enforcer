
const map: WeakMap<any, StandInReference[]> = new WeakMap()

interface StandInReference {
  parent: any
  key: any
}

export class StandIn {
  private hasReplacement: boolean
  private replacement: any

  constructor (parent: any, key: any) {
    map.set(this, [{ parent, key }])
    this.hasReplacement = false
  }

  add (parent: any, key: any): void {
    if (this.hasReplacement) {
      parent[key] = this.replacement
    } else {
      map.get(this)?.push({ parent, key })
    }
  }

  replace (value: any): void {
    if (this.hasReplacement) throw Error('Replace has already been called.')

    this.hasReplacement = true
    this.replacement = value

    map.get(this)?.forEach(ref => {
      ref.parent[ref.key] = value
    })

    map.delete(this)
  }
}
