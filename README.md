# html-elm [![Build Status](https://travis-ci.org/hendriklammers/html-elm.svg?branch=master)](https://travis-ci.org/hendriklammers/html-elm)

Convert HTML and SVG to Elm code


## Install

```
$ npm install html-elm
```


## Usage

```js
import htmlElm from 'html-elm'

const htmlString = '<div class="wrapper"><h1 id="title">Hello World</h1></div>'

// htmlElm returns a Promise
htmlElm(htmlString, {
  indent: 2,
  htmlAlias: 'Html',
  htmlAttributeAlias: 'H',
  svgAlias: 'Svg',
  svgAttributeAlias: 'S',
  imports: true,
}).then(console.log)

// Result will be a string with valid Elm code:
//
// import Html
// import Html.Attributes as H
//
// Html.div
//   [ H.class "wrapper" ]
//   [ Html.h1
//     [ H.id "title" ]
//     [ Html.text "Hello World" ]
//   ]

// All options are optional
htmlElm(html)
```


## CLI

Install it globally

```
$ npm install -g html-elm
```

Usage:

```
$ html-elm '<div class="container"><h1>Hello all</h1><p>Lorem ipsum dolor</p></div>'

div
    [ class "container" ]
    [ h1
        []
        [ text "Hello all" ]
    , p
        []
        [ text "Lorem ipsum dolor" ]
    ]
```

To see all available options use:

```
$ html-elm -h
```

## License

MIT

