#!/usr/bin/env node
import program from 'commander'
import convert from './index'

program
  .version('1.0.0')
  .option('-i, --indent <n>', 'Number of spaces used for indentation', 4)
  .parse(process.argv)

const elmString = convert(program.args.join(''), { indent: program.indent })
if (elmString) {
  console.log(elmString)
} else {
  console.log('Please provide a valid HTML string to be converted to Elm')
}
