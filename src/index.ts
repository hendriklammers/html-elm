import htmlparser from 'htmlparser2'

enum Previous {
  Open,
  Close,
  Text,
  None,
}

type Output = string[]

const getPrevious = (output: Output): Previous => {
  const prev = output.length ? output[output.length - 1] : ''
  if (/\[$/.test(prev)) {
    return Previous.Open
  } else if (/\]$/.test(prev)) {
    return Previous.Close
  } else if (/^\stext\s".*"$/.test(prev)) {
    return Previous.Text
  }
  return Previous.None
}

const attribsToString = (attribs: { [type: string]: string }): string => {
  const str = Object.entries(attribs)
    .map(([key, value]) => {
      // The Html.Attributes package uses type_
      if (key === 'type') {
        key = 'type_'
      }
      // Treat attributes without value as truthy boolean
      value = value ? `"${value}"` : 'True'
      return ' ' + key + ' ' + value
    })
    .join(',')
  return str ? str + ' ' : ''
}

const convert = (input: string, indent = 4): string => {
  const spaces = (amount: number) => ' '.repeat(amount * indent)
  const output: Output = []
  let depth = 0

  const parser = new htmlparser.Parser(
    {
      onopentag: (name, attribs) => {
        let open = ''
        switch (getPrevious(output)) {
          case Previous.Open:
            open += ' '
            break
          case Previous.Close:
          case Previous.Text:
            open += '\n' + spaces(depth) + ', '
            break
        }
        depth++
        open += name
        open += '\n' + spaces(depth) + '['
        open += attribsToString(attribs)
        open += ']\n' + spaces(depth) + '['
        output.push(open)
      },

      ontext: text => {
        if (text.trim().length) {
          if (getPrevious(output) === Previous.Close) {
            output.push('\n' + spaces(depth) + ',')
          }
          output.push(` text "${text.trim()}"`)
        }
      },

      onclosetag: _ => {
        let close = ''
        switch (getPrevious(output)) {
          case Previous.Close:
            close += '\n' + spaces(depth)
            break
          case Previous.Text:
            close += ' '
            break
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
