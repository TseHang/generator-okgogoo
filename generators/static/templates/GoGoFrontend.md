# GoGo Frontend
- By [generator-okgogoo](https://github.com/TseHang/generator-okgogoo)

It helps you to construct and orginize your static code , quickly minify html , css , js , img.  

Use [gulp](http://gulpjs.com) and [canner-core](https://www.npmjs.com/package/canner-core)
( The html's template is [hbs](http://handlebarsjs.com) )

+ gulp
+ gulp-compass
+ gulp-concat
+ gulp-imagemin
+ gulp-minify-css
+ gulp-plumber
+ gulp-rename
+ gulp-uglify
+ gulp-clean-css
+ canner-core
+ minist

## Directory

#### `./sass`
sass / scss code
+ input : sass /
+ output : dist / css /

#### `./js`
puts js code
+ input : js /
+ output : dist / js

#### `./dist` 
**minify's code (css , js , img , bgm)**

#### `./src`
some library code ( js , css )
ex: [normalize.css](https://necolas.github.io/normalize.css/)

#### `./lib`
**minify's library code**

#### `./layout`
**hbs template** ( include partial )

#### `./bin`
Use **build** to control hbs transforming.

#### `./route.js`
control the data to transform hbs's template
- data : hbs's data
- partials : partial.js
- layout : input file
- filename : output file   

```
var route = [
{
  data: {
  path: './',
  title: 'Hello guys',
  first_word: 'It is a good template'
  },
  partials: './partial.js',
  layout:  "./layout/index.hbs", 
  filename: "./index.html" 
}
];
module.exports = route;
```

#### `./partial.js`
**partial hbs** &nbsp;&nbsp;&nbsp;&nbsp;ex: {{> head}}

#### `./gulpfile.js`
control gulp

#### `./config.rb`
a config.rb for [compass](http://compass-style.org)

## License
MIT © [TseHang](https://github.com/TseHang)