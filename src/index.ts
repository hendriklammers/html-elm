import htmlparser from 'htmlparser2'

const parser = new htmlparser.Parser({
  onopentag: (name, attribs) => {
    console.log('name', name)
    console.log('attribs', attribs)
  },
})

parser.write('<div class="foo"><span>Hello world</span></div>')
parser.end()
