#!/usr/bin/env node
import { Command } from 'commander'
import convert from './index'

// Need to use require here otherwise tsc will add the package.json to lib/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json')

const program = new Command()

program
  .version(version)
  .option('-i, --indent <number>', 'Number of spaces used for indentation', '4')
  .option('-m, --imports <boolean>', 'Add module imports to output', false)
  .option(
    '-t, --html-alias <alias>',
    'Optional alias to use in front of html tags'
  )
  .option(
    '-a, --html-attribute-alias <alias>',
    'Optional alias to use in front of html attribute names'
  )
  .option(
    '-s, --svg-alias <alias>',
    'Optional alias to use in front of svg tags'
  )
  .option(
    '-g, --svg-attribute-alias <alias>',
    'Optional alias to use in front of svg attribute names'
  )
  .parse(process.argv)

// const options = {
//   indent: program.indent,
//   htmlAlias: program.htmlAlias,
//   htmlAttributeAlias: program.htmlAttributeAlias,
//   svgAlias: program.svgAlias,
//   svgAttributeAlias: program.svgAttributeAlias,
//   imports: program.imports,
// }

const options = program.opts()

const main = async () => {
  try {
    const result = await convert(program.args.join(''), options)
    process.stdout.write(result + '\n')
  } catch (err) {
    process.stdout.write(err + '\n')
    process.exit(1)
  }
}

main()
