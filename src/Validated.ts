
export function validated<T> (value: T): T {
  if (Array.isArray(value)) {

  } else if (value && typeof value === 'object') {
    
  } else {
    return value
  }
}