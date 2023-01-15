
export interface IChain<D> {
  add: (item: D) => IChain<D>
  getAncestor: (find: string | ((item: D, index: number) => boolean)) => D | undefined
  at: (index: number) => D | undefined

  length: number
  root: D | undefined
}