# small-excel
small web app on vanilla js

Try it [Small-excel](http://www.zamarawka.tw1.ru/small-excel/).

## What it can

* MS Excel UX
* keyboard navigation
* MS Excel like expressions
* copy/paste many cells
* You could write your own expressions in src/computeMethods.js
* save table data in .json files
* it could used .json files in format [[1, 3, 4], [1, 2, 3], [1, 3, 4]] for processing

## How it made

It written on vanilla js without frameworks on ES5 with arrow-function from ES6. Build by webpack 2.4 with ♥. Styles on vanilla css.

## Development

Dev build with watch and sourcemaps

```sh
$ npm run dev
```

Production build with minifiaction
```sh
$ npm run build
```