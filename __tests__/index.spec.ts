import { parseHtml } from '../src/index'

describe('parseHtml function', () => {
  it('converts a single html element string into elm-html', () => {
    const html = '<div>Hello world</div>'
    const elm = `div
    []
    [ text "Hello world" ]`

    expect(parseHtml(html)).toBe(elm)
  })
})
