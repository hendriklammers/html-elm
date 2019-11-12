import path from 'path'
import { exec } from 'child_process'

const cli = (
  args: string[],
  cwd: string
): Promise<{
  code: number
  error: Error | null
  stdout: string
  stderr: string
}> =>
  // TODO: Use util.promisify
  new Promise(resolve => {
    exec(
      `ts-node ${path.resolve('./src/cli')} ${args.join(' ')}`,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr,
        })
      }
    )
  })

describe('CLI', () => {
  it('should have a --help flag', async () => {
    const { stdout } = await cli(['--help'], '.')
    expect(stdout).toMatchSnapshot()
  })

  it('should convert html to elm', async () => {
    const html = `'<div>Hello world</div>'`
    const { stdout } = await cli([html], '.')
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
    const { stdout } = await cli(args, '.')
    expect(stdout).toMatchSnapshot()
  })
})
