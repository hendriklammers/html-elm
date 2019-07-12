#!/usr/bin/env node
import program from 'commander'
import convert from './index'

program
  .version('1.2.1')
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
  process.stdout.write(convert(program.args.join(''), options) + '\n')
} else {
  // When data is piped into the program
  let data = ''
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', chunk => (data += chunk))
  process.stdin.on('end', () =>
    process.stdout.write(convert(data, options) + '\n')
  )
}
