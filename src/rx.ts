
interface PatternMap {
  binary: RegExp
  boolean: RegExp
  byte: RegExp
  date: RegExp
  'date-time': RegExp
  dateTime: RegExp
  integer: RegExp
  number: RegExp

  extension: RegExp
  contentType: RegExp
  mediaType: RegExp
  semver: RegExp
}

const patterns: PatternMap = {
  binary: /^(?:[01]{8})+$/,
  boolean: /^(?:true|false)$/,
  byte: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
  date: /^(\d{4})-(\d{2})-(\d{2})$/,
  dateTime: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|([+-]\d{2}:?\d{2}))$/i,
  'date-time': /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|([+-]\d{2}:?\d{2}))$/i,
  integer: /^-?\d+$/,
  number: /^-?\d+(?:\.\d+)?$/,

  extension: /^x-/,
  contentType: /(?:^multipart\/)|(?:^application\/x-www-form-urlencoded$)/,
  mediaType: /^(?:\*|(application|audio|example|font|image|message|model|multipart|text|video|x-\S+))\/(?:\*|(?:([\w.-]+)\+)?([\w.-]+)(?:; *(.+))?)$/,
  semver: /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/
}

export default patterns
