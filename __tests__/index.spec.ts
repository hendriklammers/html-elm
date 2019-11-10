import convert from '../src/index'

describe('Convert html to Elm', () => {
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

  it('has a htmlAttributeAlias option', async () => {
    const html =
      '<input class="form-control" type="text" placeholder="Search" readonly>'
    const elm = `input
    [ A.class "form-control", A.type_ "text", A.placeholder "Search", A.readonly True ]
    []`
    const result = await convert(html, { htmlAttributeAlias: 'A' })
    expect(result).toBe(elm)
  })

  it('has an indent option', async () => {
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

  it('has an imports option', async () => {
    const html = '<div class="wrapper"><h1 id="title">title</h1></div>'
    const elm = `import Html exposing (div, h1, text)
import Html.Attributes exposing (class, id)

div
    [ class "wrapper" ]
    [ h1
        [ id "title" ]
        [ text "title" ]
    ]`

    const result = await convert(html, { imports: true })
    expect(result).toBe(elm)
  })

  it('supports imports with aliases', async () => {
    const html = '<div class="wrapper"><h1 id="title">title</h1></div>'
    const elm = `import Html exposing (div, h1, text)
import Html.Attributes as Attr

div
    [ Attr.class "wrapper" ]
    [ h1
        [ Attr.id "title" ]
        [ text "title" ]
    ]`

    const result = await convert(html, {
      htmlAttributeAlias: 'Attr',
      imports: true,
    })
    expect(result).toBe(elm)
  })
})

describe('Convert SVG to Elm', () => {
  it('converts element', async () => {
    const svg = `<svg width="150" height="150" viewBox="0 0 150 150" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M75 150C116.421 150 150 116.421 150 75C150 33.5786 116.421 0 75 0C33.5786 0 0 33.5786 0 75C0 116.421 33.5786 150 75 150ZM117.426 75L75 32.5736L32.5736 75L75 117.426L117.426 75Z" fill="#1061FF"/>
</svg>`
    const elm = `svg
    [ width "150", height "150", viewBox "0 0 150 150", fill "none" ]
    [ path
        [ fillRule "evenodd", clipRule "evenodd", d "M75 150C116.421 150 150 116.421 150 75C150 33.5786 116.421 0 75 0C33.5786 0 0 33.5786 0 75C0 116.421 33.5786 150 75 150ZM117.426 75L75 32.5736L32.5736 75L75 117.426L117.426 75Z", fill "#1061FF" ]
        []
    ]`
    const result = await convert(svg)
    expect(result).toBe(elm)
  })

  it('works on gradients', async () => {
    const svg = `<svg width="250" height="150" viewBox="0 0 250 150" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="250" height="150" fill="url(#paint0_linear)"/>
<defs>
<linearGradient id="paint0_linear" x1="125" y1="0" x2="125" y2="150" gradientUnits="userSpaceOnUse">
<stop stop-color="#9F07E7"/>
<stop offset="1" stop-color="#00E0FF"/>
</linearGradient>
</defs>
</svg>`
    const elm = `svg
    [ width "250", height "150", viewBox "0 0 250 150", fill "none", xmlSpace "http://www.w3.org/2000/svg" ]
    [ rect
        [ width "250", height "150", fill "url(#paint0_linear)" ]
        []
    , defs
        []
        [ linearGradient
            [ id "paint0_linear", x1 "125", y1 "0", x2 "125", y2 "150", gradientUnits "userSpaceOnUse" ]
            [ stop
                [ stopColor "#9F07E7" ]
                []
            , stop
                [ offset "1", stopColor "#00E0FF" ]
                []
            ]
        ]
    ]`
    const result = await convert(svg)
    expect(result).toBe(elm)
  })

  it('ignores invalid attributes', async () => {
    const svg = `<svg width="600" height="400" viewBox="0 0 600 400" xmlFoo="foo">
<rect foo="123" width="600" height="400" fill="#FFDA1A" bar="bar" />
</svg>`
    const elm = `svg
    [ width "600", height "400", viewBox "0 0 600 400" ]
    [ rect
        [ width "600", height "400", fill "#FFDA1A" ]
        []
    ]`
    const result = await convert(svg)
    expect(result).toBe(elm)
  })

  it('has a svgAlias and svgAttributeAlias option', async () => {
    const svg = `<svg width="600" height="400" viewBox="0 0 600 400">
<rect width="600" height="400" fill="#FFDA1A" />
</svg>`
    const elm = `Svg.svg
    [ SA.width "600", SA.height "400", SA.viewBox "0 0 600 400" ]
    [ Svg.rect
        [ SA.width "600", SA.height "400", SA.fill "#FFDA1A" ]
        []
    ]`
    const result = await convert(svg, {
      svgAlias: 'Svg',
      svgAttributeAlias: 'SA',
    })
    expect(result).toBe(elm)
  })

  it('supports svg inside html', async () => {
    const html = `<section>
  <h1 class="title">Hello</h1>
  <div>
    <svg width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#FFDA1A" />
    </svg>
  </div>
</section>`
    const elm = `import Html exposing (div, h1, section, text)
import Html.Attributes as HA
import Svg
import Svg.Attributes as SA

section
    []
    [ h1
        [ HA.class "title" ]
        [ text "Hello" ]
    , div
        []
        [ Svg.svg
            [ SA.width "600", SA.height "400", SA.viewBox "0 0 600 400" ]
            [ Svg.rect
                [ SA.width "600", SA.height "400", SA.fill "#FFDA1A" ]
                []
            ]
        ]
    ]`
    const result = await convert(html, {
      htmlAttributeAlias: 'HA',
      svgAlias: 'Svg',
      svgAttributeAlias: 'SA',
      imports: true,
    })
    expect(result).toBe(elm)
  })
})
