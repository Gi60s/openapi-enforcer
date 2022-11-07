
export interface ILastly<D> extends Array<(data: D) => void> {
  run: (data: D) => void
}
