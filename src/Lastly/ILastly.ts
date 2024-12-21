
export interface ILastly {
  add: (fn: (mode: 'build' | 'validate') => void) => void
  addSingleton: (componentId: string, fn: ((mode: 'build' | 'validate') => void)) => void
  run: () => void
}
