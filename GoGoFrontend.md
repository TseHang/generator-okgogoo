# GoGo Frontend
- By [generator-okgogoo](https://github.com/TseHang/generator-okgogoo)

It helps you to construct and orginize your static code , quickly minify html , css , js , open server, and compress img.  

#### A QUICK START FOR FRONTEND
- Support ES6、Sass(Compass)、Hbs
- Support livereload

```
＄ sudo npm install
```

#### description
It use [gulp](http://gulpjs.com) to compress , minify , open server, build system.
( The html's template is [handlebars](http://handlebarsjs.com) )


#### command

build sass , js , hbs , open a server(`port: 8000`), then watch
```
$ gulp
``` 

minify css , js, html, compress img 
```
$ gulp minify
```


concate **`./src/*.css`** file to `./lib/library.min.css` file ,  reduce request (So do .js)
```
$ gulp concate-css
$ gulp concate-js
```

## Structure

#### `./sass`
sass / scss code (import `normalize.css` initially)
+ input : sass /
+ output : dist / css /

#### `./js`
puts js (ES6) code
+ input : js /
+ output : dist / js

#### `./dist` 
**minify's code (css , js , img , bgm)**

#### `./src`
some library code ( js , css )
ex: [jQurty](https://jquery.com)

#### `./lib`
**minify's library code**

#### `./layout`
**hbs template** ( include partial )

#### `./hbsRouter.js`
control the data to transform hbs's template. Look [gulp-hbs-router](https://www.npmjs.com/package/gulp-hbs-router)

```javascript
const hbsRouter = {
  index: {
    author: '',
    description: '',
    website: 'www.sample.com.tw',
    website_name: 'Gulp-Frontend-Start!',
    keywords: '',
    first_meet: 'This is index.html!!',
  },
};
module.exports = hbsRouter;
```

#### `./partial.js`
**controll partial hbs.** Look [gulp-hbs-router](https://www.npmjs.com/package/gulp-hbs-router)

#### `./gulpfile.js`
control gulp

#### `./config.rb`
a config.rb for [compass](http://compass-style.org)

## License
MIT © [TseHang](https://github.com/TseHang)