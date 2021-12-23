export class Lastly<D> extends Array<(data: D) => void> {
  private completedData: D | undefined = undefined

  push (...items: Array<(data: D) => void>): number {
    let count = super.push(...items)
    if (this.completedData !== undefined) {
      this.run(this.completedData)
      count = 0
    }
    return count
  }

  run (data: D): void {
    let done = false
    do {
      const fn = this.shift()
      if (fn === undefined) {
        done = true
      } else {
        fn(data)
      }
    } while (!done)
    this.completedData = data
  }
}
