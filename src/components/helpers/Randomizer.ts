import { isNumber, round } from '../../utils/util'
import RandExp from 'randexp'

export interface RandomBuffer {
  maxLength?: number
  minLength?: number
  multiplier?: number
}

export interface RandomNumber {
  decimalPlaces?: number
  exclusiveMax?: boolean
  exclusiveMin?: boolean
  max?: number
  min?: number
  multipleOf?: number
  spread?: number
}

export interface RandomText {
  maxLength?: number
  minLength?: number
  pattern?: RegExp
}

const punctuation = ',,,,,,,,,,.................................:;!?'
const punctuationCount = punctuation.length
const words = 'lorem ipsum dolor sit amet consectetur adipiscing elit suspendisse sollicitudin felis pretium laoreet tortor facilisis a integer eu metus velit praesent varius sed erat quis ornare nunc porttitor nulla at ultrices nam ac vestibulum metus maecenas malesuada lectus leo blandit a congue gravida phasellus consectetur libero et tincidunt diam pellentesque lacus neque eros sed porta nunc id lobortis eget ligula mollis nulla nunc maximus gravida felis finibus est ullamcorper pellentesque ex in turpis pharetra dictum in fermentum arcu mauris odio molestie iaculis accumsan nec convallis nec nunc vestibulum nisl curabitur tristique non porttitor vivamus dui ipsum orci eget vulputate lacus interdum suscipit massa elementum sodales at interdum fames ante primis in faucibus duis mi pulvinar accumsan donec odio enim sed dignissim turpis quisque vitae turpis ut nibh tincidunt aliquam magna semper aliquam feugiat sapien justo egestas condimentum metus tincidunt odio volutpat vehicula pulvinar arcu diam bibendum sem leo sodales eleifend vehicula fusce faucibus quam lorem rhoncus amet hendrerit rhoncus augue mattis commodo lobortis urna consequat hendrerit enim risus placerat eros euismod ligula tellus tempus condimentum ac lectus erat ultrices mi lacus nisi scelerisque vehicula cursus cras enim elit aenean aliquam tempor ullamcorper est proin aliquet orci et augue posuere viverra massa augue purus orci purus neque ut elit pretium molestie vel tellus ex consequat tristique urna fringilla dignissim ex lectus imperdiet lobortis potenti efficitur feugiat facilisi placerat posuere bibendum velit volutpat dapibus donec'.split(' ')
const wordCount = words.length

export function buffer ({ maxLength, minLength, multiplier }: RandomBuffer = {}): Buffer {
  if (multiplier === undefined) multiplier = 1
  if (minLength === undefined) minLength = 0
  if (maxLength === undefined) maxLength = 50
  const length = number({ min: minLength * multiplier, max: maxLength * multiplier })
  const array = []
  for (let i = 0; i < length; i++) array.push(Math.floor(Math.random() * 256))
  return Buffer.from(array)
}

export function number ({ min, max, multipleOf, exclusiveMin = false, exclusiveMax = false, decimalPlaces = 0, spread = 1000 }: RandomNumber = {}): number {
  const minIsNumber = isNumber(min)
  const maxIsNumber = isNumber(max)

  if (isNumber(multipleOf) && typeof multipleOf === 'number' && multipleOf > 0) {
    if (typeof min === 'number') {
      const modMin = min % multipleOf
      if (modMin !== 0) min += multipleOf - modMin
    } else {
      min = 0
    }

    if (typeof max === 'number') {
      max -= max % multipleOf
    } else {
      max = multipleOf * 100
    }

    const index = Math.round(Math.random() * (max - min) / multipleOf)
    return index * multipleOf
  } else {
    if (typeof min !== 'number') min = 0
    if (typeof max !== 'number') max = 100

    const multiplier = minIsNumber && maxIsNumber ? max - min : spread
    let num = Math.random() * multiplier
    if (minIsNumber) num += min

    num = round(num, decimalPlaces)

    if (minIsNumber) {
      if (num < min) num = min
      if (num === min && exclusiveMin) num += Math.pow(10, -1 * decimalPlaces)
    }
    if (maxIsNumber) {
      if (num > max) num = max
      if (num === max && exclusiveMax) num -= Math.pow(10, -1 * decimalPlaces)
    }

    if (minIsNumber && (num < min || (num === min && exclusiveMin))) throw new RandomError('Unable to generate random number that meets minimum constraint.')
    if (maxIsNumber && (num > max || (num === max && exclusiveMax))) throw new RandomError('Unable to generate random number that meets maximum constraint.')
    return num
  }
}

export function oneOf<T> (items: T[]): T {
  const length = items.length
  const index = Math.floor(Math.random() * length)
  return items[index]
}

export class RandomError extends Error {

}

export function text (options: RandomText = {}): string {
  const { minLength = 1, maxLength = 250 } = options
  const length = number({ min: minLength, max: maxLength }) + 1

  if (options.pattern !== undefined) {
    return new RandExp(options.pattern).gen()
  } else {
    let result = ''
    let punctuationIndex = 1
    let uc = true
    while (result.length < length) {
      const index = Math.floor(Math.random() * wordCount)
      let word = words[index]
      if (uc) word = word[0].toUpperCase() + word.substring(1)
      uc = false
      result += word
      if (Math.random() >= punctuationIndex) {
        punctuationIndex = 1
        const index = Math.floor(Math.random() * punctuationCount)
        const punct = punctuation[index]
        if (/[.!?]/.test(punct)) uc = true
        result += punct
      } else {
        punctuationIndex *= 0.9
      }
      result += ' '
    }
    result = result.trim()
    result = result.replace(/[,.:;!?]$/, '') // if ends in punctuation then remove it
    if (maxLength > 5) {
      if (result.length >= maxLength) result = result.substr(0, maxLength - 1)
      result += '.'
    } else if (result.length > maxLength) {
      result = result.substr(0, maxLength)
    }
    return result
  }
}
