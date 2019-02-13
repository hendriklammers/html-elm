import { convert } from '../src/index'

describe('convert function', () => {
  it('converts a single html element string into elm-html', () => {
    const html = '<div>Hello world</div>'
    const elm = `div
    []
    [ text "Hello world" ]`

    expect(convert(html)).toBe(elm)
  })

  it('trims whitespace', () => {
    const html = `<div>
        Hello world   </div>`
    const elm = `div
    []
    [ text "Hello world" ]`
    expect(convert(html)).toBe(elm)
  })

  it('works with nested tags', () => {
    const html = '<div><span>Hello world</span><span>second</span></div>'
    const elm = `div
    []
    [ span
        []
        [ text "Hello world" ]
    , span
        []
        [ text "second" ]
    ]`

    expect(convert(html)).toBe(elm)
  })

  it('parses the attributes', () => {
    const html = `<input class="form-control" type="text" placeholder="Search" readonly>`
    const elm = `input
    [ class "form-control", type_ "text", placeholder "Search", readonly True ]
    []`
    expect(convert(html)).toBe(elm)
  })
})
