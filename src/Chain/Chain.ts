import { IChain } from './IChain'

export class Chain<D=any> implements IChain<D> {
  private readonly items: D[]

  constructor (init?: D[]) {
    this.items = init ?? []
  }

  add (item: D): Chain {
    const items = this.items.slice(0)
    items.unshift(item)
    return new Chain(items)
  }

  getAncestor (find: (item: D, index: number) => boolean): D | undefined {
    const items = this.items
    const length = items.length
    for (let i = 0; i < length; i++) {
      if (find(items[i], i)) return items[i]
    }
  }

  at (index: number): D | undefined {
    if (index < 0) index += this.length
    return this.items[index]
  }

  get length (): number {
    return this.items.length
  }

  get root (): D | undefined {
    return this.at(-1)
  }

  [Symbol.iterator] (): Iterator<any> {
    throw Error('Method not implemented')
  }
}

Chain.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
