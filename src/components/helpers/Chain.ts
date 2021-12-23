interface Data {
  component: {
    data: Data
  }
  context: {
    chain: Chain<Data>
    key: string
  }
}

export class Chain<D extends Data> extends Array<D> {
  toString (): string {
    const start = this.length - 1
    const ar: string[] = []
    for (let i = start; i >= 0; i--) {
      let node: D = this[i]
      let value = node.context.key
      if (node === node.component.data) value += ' [' + node.component.constructor.name + ']'
      node = node.context.chain[0] as D
      ar.push(value)
    }
    return ar.join(' > ')
  }
}
