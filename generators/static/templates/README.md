# <%= projectName %>

<%= description %>

## Getting Started

#### Install package
```
npm install -i
```

## Usage
build sass , js 
```
$ gulp
```

build hbs to html, and watch
```
$ ./bin/build -w
```

- Use `gulp` to construct it .
- `canner-core` is your main component which you also use in `handlebar.js`.

#### About GoGo Frontend 
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

## Developer

### gulp

build sass , js , then watch
```
$ gulp
``` 

minify css , js
```
$ gulp minify-css
$ gulp minify-js
```


concate all lib **js** or **css** file to one file ,  reduce request
```
$ gulp concate-css
$ gulp concate-js
```

compress img ( It's usually use on final in your project)
```
$ gulp image
```

### canner-core

build **hbs to html**
```
$ ./bin/build 
```

+ -w : watch
+ -m : minify code

## Intro every dirname

### ./sass
puts sass / scss code
+ input : sass /
+ output : dist / css /

### ./js
puts js code
+ input : js /
+ output : dist / js

### ./dist 
puts **minify's code (css , js , img , bgm)**

### ./src
put some library code ( js , css )
ex: [normalize.css](https://necolas.github.io/normalize.css/)

### ./lib
puts **minify's library code**

### ./layout
puts **hbs template** ( include partial )

### ./bin
A **build file** to control hbs transforming.

### ./route.js
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

### ./partial.js
**partial hbs** &nbsp;&nbsp;&nbsp;&nbsp;ex: {{> head}}

### ./gulpfile.js
control gulp

### ./config.rb
a config.rb for [compass](http://compass-style.org)

## License
<%= license %> © [<%= authorName %>](<%= authorUrl %>)