import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

// Helper function that runs the cli binary with ts-node
const cli = (
  args: string[]
): Promise<{
  stdout: string
  stderr: string
}> => promisify(exec)(`ts-node ${path.resolve('./src/cli')} ${args.join(' ')}`)

describe('CLI', () => {
  it('should convert html to elm', async () => {
    const html = `'<div>Hello world</div>'`
    const { stdout } = await cli([html])
    expect(stdout).toMatchSnapshot()
  })

  it('should support all available options', async () => {
    const html = `'<section><h1 class="title">Hello</h1><div><svg width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#FFDA1A" /></svg></div></section>'`
    const args = [
      html,
      '-i 2',
      '--imports true',
      '-t Html',
      '-a H',
      '-s Svg',
      '-g S',
    ]
    const { stdout } = await cli(args)
    expect(stdout).toMatchSnapshot()
  })
})
