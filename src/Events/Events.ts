import { IEvents } from './IEvents'

// @ts-expect-error
const handlers: Record<keyof IEvents, Array<(payload: any) => void>> = {}

export function emit<E extends keyof IEvents> (event: E, payload: IEvents[E]): void {
  if (handlers[event] !== undefined) {
    handlers[event].forEach(handler => handler(payload))
  }
}

export function on<E extends keyof IEvents> (event: E, handler: (payload: IEvents[E]) => void): void {
  if (handlers[event] === undefined) handlers[event] = []
  handlers[event].push(handler)
}

export function off<E extends keyof IEvents> (event: E, handler: (payload: IEvents[E]) => void): void {
  if (handlers[event] !== undefined) {
    const index = handlers[event].indexOf(handler)
    if (index !== -1) handlers[event].splice(index, 1)
  }
}

export function once<E extends keyof IEvents> (event: E, handler: (payload: IEvents[E]) => void): void {
  on(event, payload => {
    off(event, handler)
    handler(payload)
  })
}
