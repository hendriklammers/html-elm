#!/usr/bin/env node
import program from 'commander'
import convert from './index'

// Need to use require here otherwise tsc will add the package.json to lib/
const pkg = require('../package.json')

program
  .version(pkg.version)
  .option('-i, --indent [n]', 'Number of spaces used for indentation', 4)
  .option(
    '-t, --html-alias [prefix]',
    'Optional prefix to use in front of html tags'
  )
  .option(
    '-a, --attribute-alias [prefix]',
    'Optional prefix to use in front of attribute names'
  )
  .parse(process.argv)

const options = {
  indent: program.indent,
  htmlAlias: program.htmlAlias,
  attributeAlias: program.attributeAlias,
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
