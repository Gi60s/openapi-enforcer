
interface PatternMap {
  [key: string]: RegExp
}

const patterns: PatternMap = {
  binary: /^(?:[01]{8})+$/,
  boolean: /^(?:true|false)$/,
  byte: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
  date: /^(\d{4})-(\d{2})-(\d{2})$/,
  dateTime: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|([+-]\d{2}:?\d{2}))$/i,
  integer: /^-?\d+$/,
  number: /^-?\d+(?:\.\d+)?$/,
  semver: /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/
}
patterns['date-time'] = patterns.dateTime

export default patterns
