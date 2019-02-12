import htmlparser from 'htmlparser2'

const parseHtml = (input: string, indentation = 4) => {
  const indent = ' '.repeat(indentation)
  let output = ''

  const parser = new htmlparser.Parser(
    {
      onopentag: (name, attribs) => {
        output += name
        output += '\n' + indent + '[]'
        output += '\n' + indent + '['
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

export { parseHtml }
