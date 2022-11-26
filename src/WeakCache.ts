
const store: Record<string, WeakMap<any, any> | undefined> = {}

export function cached<T> (id: string, key: any, callback: (...p: any[]) => T, ...params: any[]): T {
  if (store[id] === undefined) store[id] = new WeakMap<any, any>()
  const existing = store[id]?.get(key)
  if (existing !== undefined) {
    return existing
  } else {
    // eslint-disable-next-line node/no-callback-literal
    const value = callback(...params)
    store[id]?.set(key, value)
    return value
  }
}

export function clear (id: string): void {
  const rx = new RegExp(id
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.+')
  )
  Object.keys(store).forEach(key => {
    if (rx.test(key)) {
      store[key] = undefined
    }
  })
}
