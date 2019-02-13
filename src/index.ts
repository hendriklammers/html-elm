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

const parseHtml = (input: string): string => {
  const output: string[] = []
  const children = new Set()
  let depth = 0

  const parser = new htmlparser.Parser(
    {
      onopentag: (name, attribs) => {
        let open = ''
        if (children.has(depth)) {
          open += `\n${spaces(depth)}, `
        }
        children.add(depth)
        depth++
        open += name
        open += '\n' + spaces(depth) + '['
        open += attribsToString(attribs)
        open += ']\n' + spaces(depth) + '[ '
        output.push(open)
      },

      ontext: text => {
        if (text.trim().length) {
          output.push(`text "${text.trim()}" `)
        }
      },

      onclosetag: name => {
        let close = ''
        if (children.has(depth)) {
          close += '\n' + spaces(depth)
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

const html = `<div>
  <h1><span>hello world</span></h1>
  <p>lorem ipsum</p>
</div>`
console.log(parseHtml(html))

export { parseHtml }
