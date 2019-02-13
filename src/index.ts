import htmlparser from 'htmlparser2'

const attribsToString = (attribs: { [type: string]: string }): string => {
  const str = Object.entries(attribs)
    .map(([key, value]) => {
      // The Html.Attributes package uses type_
      if (key === 'type') {
        key = 'type_'
      }
      // Treat attributes without value as boolean ('readonly' for example)
      value = value ? `"${value}"` : 'True'
      return ' ' + key + ' ' + value
    })
    .join(',')
  return str ? str + ' ' : ''
}

const spaces = (depth: number, indent = 4) => ' '.repeat(depth * indent)

const convert = (input: string, indent = 4): string => {
  const output: string[] = []
  const children = new Set()
  let depth = 0

  const parser = new htmlparser.Parser(
    {
      onopentag: (name, attribs) => {
        let open = ''
        if (children.has(depth)) {
          open += `\n${spaces(depth, indent)},`
        }
        if (depth > 0) {
          open += ' '
        }
        children.add(depth)
        depth++
        open += name
        open += '\n' + spaces(depth, indent) + '['
        open += attribsToString(attribs)
        open += ']\n' + spaces(depth, indent) + '['
        output.push(open)
      },

      ontext: text => {
        if (text.trim().length) {
          output.push(` text "${text.trim()}" `)
        }
      },

      onclosetag: name => {
        let close = ''
        if (children.has(depth)) {
          close += '\n' + spaces(depth, indent)
          children.delete(depth)
        }
        close += ']'
        depth--
        output.push(close)
      },
    },
    { decodeEntities: true, lowerCaseAttributeNames: true }
  )
  parser.write(input)
  parser.end()

  return output.join('')
}

export { convert }
