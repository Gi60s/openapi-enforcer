import { ILastly } from './ILastly'

type IMode = 'build' | 'validate'

export class Lastly implements ILastly {
  private done = false
  private readonly items: Array<(mode: IMode) => void> = []
  private readonly singletons: Set<string> = new Set()
  private readonly mode: IMode

  constructor (mode: IMode) {
    this.mode = mode
  }

  add (fn: (mode: IMode) => void): void {
    this.items.push(fn)
    if (this.done) {
      this.run()
    }
  }

  addSingleton (componentId: string, fn: (mode: IMode) => void): void {
    if (!this.singletons.has(componentId)) {
      this.items.push(fn)
      this.singletons.add(componentId)
    }
  }

  run (): void {
    let fn: ((mode: IMode) => void) | undefined = this.items.shift()
    while (fn !== undefined) {
      fn(this.mode)
      fn = this.items.shift()
    }
    this.done = true
  }
}
