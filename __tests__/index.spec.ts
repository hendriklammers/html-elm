import convert from '../src/index'

describe('Convert html to elm', () => {
  it('converts a single html element', async () => {
    const html = '<div>Hello world</div>'
    const elm = `div
    []
    [ text "Hello world" ]`
    const result = await convert(html)
    expect(result).toBe(elm)
  })

  it('converts an empty tag', async () => {
    const elm = `div
    []
    []`
    const result = await convert('<div/>')
    expect(result).toBe(elm)
  })

  it('trims whitespace', async () => {
    const html = `<div>
        Hello world   </div>`
    const elm = `div
    []
    [ text "Hello world" ]`
    const result = await convert(html)
    expect(result).toBe(elm)
  })

  it('works with nested tags', async () => {
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
    const result = await convert(html)
    expect(result).toBe(elm)
  })

  it('has a htmlAlias option', async () => {
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
    const result = await convert(html, { htmlAlias: 'H' })
    expect(result).toBe(elm)
  })

  it('parses attributes', async () => {
    const html =
      '<input class="form-control" type="text" placeholder="Search" readonly>'
    const elm = `input
    [ class "form-control", type_ "text", placeholder "Search", readonly True ]
    []`
    const result = await convert(html)
    expect(result).toBe(elm)
  })

  it('has a attributeAlias option', async () => {
    const html =
      '<input class="form-control" type="text" placeholder="Search" readonly>'
    const elm = `input
    [ A.class "form-control", A.type_ "text", A.placeholder "Search", A.readonly True ]
    []`
    const result = await convert(html, { attributeAlias: 'A' })
    expect(result).toBe(elm)
  })

  it('has and indent option', async () => {
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
    const result = await convert(html, { indent: 2 })
    expect(result).toBe(elm)
  })
})
