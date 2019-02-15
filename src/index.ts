import htmlparser from 'htmlparser2'

enum Fragment {
  Open,
  Close,
  Text,
  None,
}

const previousFragment = (fragments: string[]): Fragment => {
  const prev = fragments.length ? fragments[fragments.length - 1] : ''
  if (/\[$/.test(prev)) {
    return Fragment.Open
  } else if (/\]$/.test(prev)) {
    return Fragment.Close
  } else if (/^\stext\s".*"$/.test(prev)) {
    return Fragment.Text
  }
  return Fragment.None
}

const attributesToString = (attribs: { [type: string]: string }): string => {
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

const convert = (html: string, { indent = 4 } = {}): string => {
  const spaces = (amount: number) => ' '.repeat(amount * indent)
  const fragments: string[] = []
  let depth = 0

  const parser = new htmlparser.Parser(
    {
      onopentag: (name, attribs) => {
        let open = ''
        switch (previousFragment(fragments)) {
          case Fragment.Open:
            open += ' '
            break
          case Fragment.Close:
          case Fragment.Text:
            open += '\n' + spaces(depth) + ', '
            break
        }
        depth++
        open += name
        open += '\n' + spaces(depth) + '['
        open += attributesToString(attribs)
        open += ']\n' + spaces(depth) + '['
        fragments.push(open)
      },

      ontext: text => {
        // TODO: Add support for html tags inside text
        if (text.trim().length) {
          fragments.push(` text "${text.trim()}"`)
        }
      },

      onclosetag: _ => {
        let close = ''
        switch (previousFragment(fragments)) {
          case Fragment.Close:
            close += '\n' + spaces(depth)
            break
          case Fragment.Text:
            close += ' '
            break
        }
        close += ']'
        depth--
        fragments.push(close)
      },
    },
    { decodeEntities: true, lowerCaseAttributeNames: true }
  )
  parser.write(html)
  parser.end()

  return fragments.join('')
}

export default convert
