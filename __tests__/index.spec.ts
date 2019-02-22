import convert from '../src/index'

describe('Convert html to elm', () => {
  it('converts a single html element', () => {
    const html = '<div>Hello world</div>'
    const elm = `div
    []
    [ text "Hello world" ]`
    expect(convert(html)).toBe(elm)
  })

  it('converts an empty tag', () => {
    const elm = `div
    []
    []`
    expect(convert('<div/>')).toBe(elm)
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

  it('has a htmlAlias option', () => {
    const html = '<div><span>Hello world</span><span>second</span></div>'
    const elm = `H.div
    []
    [ H.span
        []
        [ H.text "Hello world" ]
    , H.span
        []
        [ H.text "second" ]
    ]`
    expect(convert(html, { htmlAlias: 'H' })).toBe(elm)
  })

  it('parses attributes', () => {
    const html =
      '<input class="form-control" type="text" placeholder="Search" readonly>'
    const elm = `input
    [ class "form-control", type_ "text", placeholder "Search", readonly True ]
    []`
    expect(convert(html)).toBe(elm)
  })

  it('has a attributeAlias option', () => {
    const html =
      '<input class="form-control" type="text" placeholder="Search" readonly>'
    const elm = `input
    [ A.class "form-control", A.type_ "text", A.placeholder "Search", A.readonly True ]
    []`
    expect(convert(html, { attributeAlias: 'A' })).toBe(elm)
  })

  it('has and indent option', () => {
    const html = '<div><div><p>title</p></div></div>'
    const elm = `div
  []
  [ div
    []
    [ p
      []
      [ text "title" ]
    ]
  ]`
    expect(convert(html, { indent: 2 })).toBe(elm)
  })
})
