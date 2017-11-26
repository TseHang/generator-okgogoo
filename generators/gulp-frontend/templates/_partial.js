const fs = require('fs');

const DEFAULT_PATH = 'partial/';

module.exports = (hbs) => {
  hbs.registerPartial('head', getPartials('head.hbs', DEFAULT_PATH));
  hbs.registerPartial('footer', getPartials('footer.hbs', DEFAULT_PATH));
};

function getPartials(filename, path) {
  const template = fs.readFileSync(`./layout/${path}${filename}`, 'utf8');
  // template = template.replace(/[\t\n]/g, ''); // minify partial
  return template;
}
