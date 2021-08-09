export function replaceEscapeCharacters(str: string): string {
  // Windows/MacOS/Unix file name limitations
  // /\?*:|"<>.
  // https://en.wikipedia.org/wiki/Filename
  const replacedStr: string = 
    str.replace(/\\\\u0026/, '＆')
       .replace(/\n/g, ' ')
       .replace(/%/g, '％')
       .replace(/\+/g, '＋')
       .replace(/\//g, '／')
       .replace(/\\/g, '￥')
       .replace(/\?/g, '？')
       .replace(/:/g, '：')
       .replace(/\|/g, '｜')
       .replace(/\¿/g, '-')
       .replace(/[\*]/g, '^')
       .replace(/[\"]/g, "'")
       .replace(/[\<]/g, '[')
       .replace(/[\>]/g, ']')

  if (navigator.userAgent.indexOf("Win") >= 0) {
    return replacedStr.replace(/\\/, '￥')
  } else {
    return replacedStr
  }
}

