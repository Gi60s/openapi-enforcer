
type At = 'cookie' | 'header' | 'path' | 'query'

interface MatrixInterface {
  allowedStyles: Style[]
  defaultStyle: Style
  defaultExplode: boolean
  styles: Record<Style, StyleDetails[] | null>
}

interface Matrix {
  cookie: MatrixInterface
  header: MatrixInterface
  path: MatrixInterface
  query: MatrixInterface
}

type Style = 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited'

interface StyleDetails {
  explode: boolean
  template?: string
  type: 'all' | 'array' | 'object' | 'primitive'
}

// https://swagger.io/docs/specification/serialization/
const matrix: Matrix = {
  cookie: {
    allowedStyles: ['form'],
    defaultStyle: 'form',
    defaultExplode: true,
    styles: {
      deepObject: null,
      form: [
        { explode: true, type: 'primitive' },
        { explode: false, template: '{$}', type: 'all' }
      ],
      label: null,
      matrix: null,
      pipeDelimited: null,
      simple: null,
      spaceDelimited: null
    }
  },
  header: {
    allowedStyles: ['simple'],
    defaultStyle: 'simple',
    defaultExplode: false,
    styles: {
      deepObject: null,
      form: null,
      label: null,
      matrix: null,
      pipeDelimited: null,
      simple: [
        { explode: false, template: '{$}', type: 'all' },
        { explode: true, template: '{$*}', type: 'all' }
      ],
      spaceDelimited: null
    }
  },
  path: {
    allowedStyles: ['label', 'matrix', 'simple'],
    defaultStyle: 'simple',
    defaultExplode: false,
    styles: {
      deepObject: null,
      form: null,
      label: [
        { explode: false, template: '{.$}', type: 'all' },
        { explode: true, template: '{.$*}', type: 'all' }
      ],
      matrix: [
        { explode: false, template: '{;$}', type: 'all' },
        { explode: true, template: '{;$*}', type: 'all' }
      ],
      pipeDelimited: null,
      simple: [
        { explode: false, template: '{$}', type: 'all' },
        { explode: true, template: '{$*}', type: 'all' }
      ],
      spaceDelimited: null
    }
  },
  query: {
    allowedStyles: ['deepObject', 'form', 'pipeDelimited', 'spaceDelimited'],
    defaultStyle: 'form',
    defaultExplode: true,
    styles: {
      deepObject: [
        { explode: true, type: 'object' }
      ],
      form: [
        { explode: true, template: '(?$*}', type: 'all' },
        { explode: false, template: '{?$}', type: 'all' }
      ],
      label: null,
      matrix: null,
      pipeDelimited: [
        { explode: true, template: '(?$*}', type: 'array' },
        { explode: false, type: 'array' }
      ],
      simple: null,
      spaceDelimited: [
        { explode: true, template: '(?$*}', type: 'array' },
        { explode: false, type: 'array' }
      ]
    }
  }
}

export function getValidatorSettings (at: At): { allowedStyles: Style[], defaultExplode: boolean, defaultStyle: Style } {
  const data = matrix[at]
  if (data === undefined) return { allowedStyles: [], defaultExplode: true, defaultStyle: 'form' }
  return {
    allowedStyles: data.allowedStyles,
    defaultExplode: data.defaultExplode,
    defaultStyle: data.defaultStyle
  }
}

export function styleMatchesExplode (at: string, style: string, explode: boolean): boolean {
  const data: StyleDetails[] | null = matrix[at as At]?.styles[style as Style] ?? null
  if (data === null) return false
  return data.findIndex(v => v.explode === explode) !== -1
}

export function styleMatchesIn (at: string, style: Style): boolean {
  return matrix[at as At]?.allowedStyles.includes(style)
}

export function styleMatchesType (at: string, style: string, type: string, explode: boolean): boolean {
  const data: StyleDetails[] | null = matrix[at as At]?.styles[style as Style] ?? null
  if (data === null) return false

  const index = data.findIndex(v => v.explode === explode)
  if (index === -1) return false

  const allowedTypes = data[index].type
  if (allowedTypes === 'all') return true
  if (type === 'array') return allowedTypes === 'array'
  if (type === 'object') return allowedTypes === 'object'
  return allowedTypes === 'primitive'
}
