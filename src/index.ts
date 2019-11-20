import htmlparser from 'htmlparser2'
import attributes from './attributes'

// All options are optional
export type Options = Partial<{
  indent: number
  htmlAlias: string
  htmlAttributeAlias: string
  svgAlias: string
  svgAttributeAlias: string
  imports: boolean
}>

enum Fragment {
  Open,
  Close,
  Text,
  None,
}

type Module = {
  name: string
  alias: string
  values: string[]
}

type ModuleImports = {
  html: Module
  htmlAttributes: Module
  svg: Module
  svgAttributes: Module
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
  attribs: Record<string, string>,
  alias: string,
  isSvg = false,
  imports: ModuleImports
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

      if (isSvg) {
        imports.svgAttributes.values.push(key)
      } else {
        imports.htmlAttributes.values.push(key)
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

const importsToString = (imports: ModuleImports): string => {
  const str = Object.values(imports).reduce((acc, { name, alias, values }) => {
    if (values.length) {
      if (alias.length) {
        if (alias === name) {
          return `${acc}import ${name}\n`
        } else {
          return `${acc}import ${name} as ${alias}\n`
        }
      }

      const valuesStr = [...new Set(values.sort())].join(', ')
      return `${acc}import ${name} exposing (${valuesStr})\n`
    }
    return acc
  }, '')
  return str.length ? str + '\n' : ''
}

const convert = (html: string, options: Options = {}): Promise<string> =>
  new Promise((resolve, reject) => {
    const {
      indent = 4,
      htmlAlias = '',
      htmlAttributeAlias = '',
      svgAlias = '',
      svgAttributeAlias = '',
      imports = false,
    } = options

    const spaces = (amount: number) => ' '.repeat(amount * indent)
    const fragments: string[] = []
    const moduleImports: ModuleImports = {
      html: { name: 'Html', alias: htmlAlias, values: [] },
      htmlAttributes: {
        name: 'Html.Attributes',
        alias: htmlAttributeAlias,
        values: [],
      },
      svg: { name: 'Svg', alias: svgAlias, values: [] },
      svgAttributes: {
        name: 'Svg.Attributes',
        alias: svgAttributeAlias,
        values: [],
      },
    }
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

          // When alias option is set, add in front of opening tag
          if (isSvg && svgAlias.length) {
            open += svgAlias + '.'
          } else if (htmlAlias.length) {
            open += htmlAlias + '.'
          }

          if (isSvg) {
            moduleImports.svg.values.push(name)
          } else {
            moduleImports.html.values.push(name)
          }

          open += name
          open += '\n' + spaces(depth) + '['
          open += attributesToString(
            attribs,
            isSvg ? svgAttributeAlias : htmlAttributeAlias,
            isSvg,
            moduleImports
          )
          open += ']\n' + spaces(depth) + '['
          fragments.push(open)
        },

        ontext: text => {
          if (text.trim().length) {
            moduleImports.html.values.push('text')
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

    if (imports) {
      resolve(importsToString(moduleImports) + fragments.join(''))
    } else {
      resolve(fragments.join(''))
    }
  })

export default convert
