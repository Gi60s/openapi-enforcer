
export interface ILastly {
  add: (fn: () => void) => void
  addSingleton: (componentId: string, fn: (() => void)) => void
  run: () => void
}
