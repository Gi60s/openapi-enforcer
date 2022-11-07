
interface PatternMap {
  binary: RegExp
  boolean: RegExp
  byte: RegExp
  date: RegExp
  'date-time': RegExp
  dateTime: RegExp
  integer: RegExp
  number: RegExp

  contentType: RegExp
  email: RegExp
  extension: RegExp
  http: RegExp
  mediaType: RegExp
  semver: RegExp
  url: RegExp
  urlParts: RegExp
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

  contentType: /(?:^multipart\/)|(?:^application\/x-www-form-urlencoded$)/,
  // eslint-disable-next-line no-control-regex
  email: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
  extension: /^x-/,
  http: /^https?:\/\//i,
  mediaType: /^(?:\*|(application|audio|example|font|image|message|model|multipart|text|video|x-\S+))\/(?:\*|(?:([\w.-]+)\+)?([\w.-]+)(?:; *(.+))?)$/,
  semver: /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/,
  url: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00A1-\uFFFF0-9]+-?)*[a-z\u00A1-\uFFFF0-9]+)(?:\.(?:[a-z\u00A1-\uFFFF0-9]+-?)*[a-z\u00A1-\uFFFF0-9]+)*(?:\.(?:[a-z\u00A1-\uFFFF]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/ius,
  urlParts: /^(https?):\/\/(.+?)(?:\/|$)(.*)/
}

export default patterns
