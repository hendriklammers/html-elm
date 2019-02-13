import htmlparser from 'htmlparser2'

const attribsToString = (attribs: {}): string => {
  const str = Object.entries(attribs)
    .map(attr => ' ' + attr[0] + ' "' + attr[1] + '"')
    .join(',')
  return str ? str + ' ' : ''
}

const parseHtml = (input: string) => {
  const indent = ' '.repeat(2)
  let output = ''

  const parser = new htmlparser.Parser(
    {
      onopentag: (name, attribs) => {
        output += name
        output += '\n' + indent + '['
        output += attribsToString(attribs)
        output += ']\n' + indent + '['
      },

      ontext: text => {
        if (text.trim().length) {
          output += ` text "${text.trim()}" `
        }
      },

      onclosetag: _ => {
        output += ']'
      },
    },
    { decodeEntities: true }
  )
  parser.write(input)
  parser.end()

  return output
}

const html = '<div class="container green" id="my-app">hello world</div>'
console.log(parseHtml(html))

export { parseHtml }
