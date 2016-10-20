var fs = require("fs");

module.exports= function (hbs) {
  // register partials
  hbs.registerPartial('head', getPartials('head'));
};

function getPartials(filename) {
  var template = fs.readFileSync('./layout/partial/'+filename+'.hbs', 'utf8');
  template = template.replace(/[\t\n]/g, '');
  return template;
}
