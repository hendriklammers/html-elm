# html-elm [![Build Status](https://travis-ci.org/hendriklammers/html-elm.svg?branch=master)](https://travis-ci.org/hendriklammers/html-elm)

CLI tool to convert html to elm-html


## Install

```
$ npm install -g html-elm
```


## Usage

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
