#!/usr/bin/env node
import program from 'commander'
import convert from './index'

// Need to use require here otherwise tsc will add the package.json to lib/
const pkg = require('../package.json')

program
  .version(pkg.version)
  .option('-i, --indent <number>', 'Number of spaces used for indentation', 4)
  .option('-m, --imports <boolean>', 'Add module imports to output', false)
  .option(
    '-t, --html-alias <prefix>',
    'Optional prefix to use in front of html tags'
  )
  .option(
    '-a, --html-attribute-alias <prefix>',
    'Optional prefix to use in front of html attribute names'
  )
  .option(
    '-s, --svg-alias <prefix>',
    'Optional prefix to use in front of svg tags'
  )
  .option(
    '-g, --svg-attribute-alias <prefix>',
    'Optional prefix to use in front of svg attribute names'
  )
  .parse(process.argv)

const options = {
  indent: program.indent,
  htmlAlias: program.htmlAlias,
  htmlAttributeAlias: program.htmlAttributeAlias,
  svgAlias: program.svgAlias,
  svgAttributeAlias: program.svgAttributeAlias,
  imports: program.imports,
}

if (process.stdin.isTTY) {
  convert(program.args.join(''), options).then(result =>
    process.stdout.write(result + '\n')
  )
} else {
  // When data is piped into the program
  let data = ''
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', chunk => (data += chunk))
  process.stdin.on('end', async () => {
    const result = await convert(data, options)
    process.stdout.write(result + '\n')
  })
}
