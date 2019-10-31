import htmlparser from 'htmlparser2'
import attributes from './attributes'

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
  } else if (/^\s([A-Za-z]+\.)?text\s".*"$/.test(prev)) {
    return Fragment.Text
  }
  return Fragment.None
}

const attributesToString = (
  attribs: { [type: string]: string },
  alias: string,
  isSvg = false
): string => {
  const str = Object.entries(attribs)
    .map(([key, value]) => {
      // Treat attributes without value as truthy boolean
      value = value ? `"${value}"` : 'True'

      if (key === 'type') {
        key = 'type_'
      }

      if (isSvg) {
        if (key === 'in') {
          key = 'in_'
        }

        if (key === 'xmlns') {
          key = 'xmlSpace'
        }

        // Check for svg attributes
        // TODO: Do something similar for HTML
        key = attributes.svg[key.toLowerCase().replace(/-|:/g, '')]

        // Unvalid attribute
        if (!key) {
          return ''
        }
      }

      if (alias.length) {
        key = alias + '.' + key
      }
      return ` ${key} ${value}`
    })
    .filter(attr => attr !== '')
    .join(',')
  return str ? str + ' ' : ''
}

// All options are optional
type Options = Partial<{
  indent: number
  htmlAlias: string
  htmlAttributeAlias: string
  svgAlias: string
  svgAttributeAlias: string
}>

const convert = (html: string, options: Options = {}): Promise<string> =>
  new Promise((resolve, reject) => {
    const {
      indent = 4,
      htmlAlias = '',
      htmlAttributeAlias = '',
      svgAlias = '',
      svgAttributeAlias = '',
    } = options

    const spaces = (amount: number) => ' '.repeat(amount * indent)
    const fragments: string[] = []
    let depth = 0
    let isSvg = false

    const parser = new htmlparser.Parser(
      {
        onopentag: (name, attribs) => {
          if (name.toLowerCase() === 'svg') {
            isSvg = true
          }

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

          if (isSvg && svgAlias.length) {
            open += svgAlias + '.'
          } else if (htmlAlias.length) {
            open += htmlAlias + '.'
          }

          open += name
          open += '\n' + spaces(depth) + '['
          open += attributesToString(
            attribs,
            isSvg ? svgAttributeAlias : htmlAttributeAlias,
            isSvg
          )
          open += ']\n' + spaces(depth) + '['
          fragments.push(open)
        },

        ontext: text => {
          // TODO: Add support for html tags inside text
          if (text.trim().length) {
            const tag = htmlAlias.length ? `${htmlAlias}.text` : 'text'
            fragments.push(` ${tag} "${text.trim()}"`)
          }
        },

        onclosetag: name => {
          if (name.toLowerCase() === 'svg') {
            isSvg = false
          }

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

        onerror: err => {
          reject(err)
        },
      },
      {
        decodeEntities: true,
        lowerCaseAttributeNames: false,
        lowerCaseTags: false,
      }
    )
    parser.write(html)
    parser.end()

    resolve(fragments.join(''))
  })

export default convert
