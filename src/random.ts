
export function number (config?: { decimalPlaces?: number, maximum?: number, minimum?: number, multipleOf?: number, range?: number }): number {
  const range = config?.range ?? 1000
  const decimalPlaces = Math.round(config?.decimalPlaces ?? 0)
  const maximum = config?.maximum ?? (config?.minimum !== undefined ? config.minimum + range : range)
  const minimum = config?.minimum ?? maximum - range
  const multipleOf = config?.multipleOf ?? 1
  const multiplier = Math.pow(10, decimalPlaces)

  const max = maximum * multiplier
  const min = minimum * multiplier
  let number = Math.round(Math.random() * (max - min) - min)

  if (number > max) number = max
  if (number < min) number = min

  if (multipleOf !== 0 && multipleOf !== 1) {
    const mult = multipleOf * multiplier
    number = Math.round(number / mult) * mult
  }

  if (decimalPlaces > 0) {
    number /= multiplier
  }

  return number
}
