#!/usr/bin/env node
import program from 'commander'
import convert from './index'

program
  .version('1.0.0')
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

const elmString = convert(program.args.join(''), {
  indent: program.indent,
  htmlAlias: program.htmlAlias,
  attributeAlias: program.attributeAlias,
})
if (elmString) {
  console.log(elmString)
} else {
  console.log('Please provide a valid HTML string to be converted to Elm')
}
