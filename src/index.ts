import htmlparser from 'htmlparser2'

interface Attributes {
  [type: string]: string
}

const attribsToString = (attribs: Attributes): string => {
  const str = Object.keys(attribs)
    .map(key => ' ' + key + ' "' + attribs[key] + '"')
    .join(',')
  return str ? str + ' ' : ''
}

const spaces = (depth: number) => ' '.repeat(depth * 2)

const parseHtml = (input: string) => {
  let indent = 0
  let output = ''

  const parser = new htmlparser.Parser(
    {
      onopentag: (name, attribs) => {
        if (indent > 0) {
          output += ' '
        }
        indent++
        output += name
        output += '\n' + spaces(indent) + '['
        output += attribsToString(attribs)
        output += ']\n' + spaces(indent) + '['
      },

      ontext: text => {
        if (text.trim().length) {
          output += ` text "${text.trim()}" `
        }
      },

      onclosetag: _ => {
        indent--
        output += '\n' + spaces(indent) + ']'
      },
    },
    { decodeEntities: true }
  )
  parser.write(input)
  parser.end()

  return output
}

const html = `<div class="container green" id="my-app">
  <span>
    <h1 class="title">hello world</h1>
  </span>
</div>`
console.log(parseHtml(html))

export { parseHtml }
