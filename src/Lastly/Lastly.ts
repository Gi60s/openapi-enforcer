import { ILastly } from './ILastly'

export class Lastly implements ILastly {
  private done = false
  private readonly items: Array<() => void> = []
  private readonly singletons: Set<string> = new Set()

  add (fn: () => void): void {
    this.items.push(fn)
    if (this.done) {
      this.run()
    }
  }

  addSingleton (componentId: string, fn: () => void): void {
    if (!this.singletons.has(componentId)) {
      this.items.push(fn)
      this.singletons.add(componentId)
    }
  }

  run (): void {
    let fn: (() => void) | undefined = this.items.shift()
    while (fn !== undefined) {
      fn()
      fn = this.items.shift()
    }
    this.done = true
  }
}
