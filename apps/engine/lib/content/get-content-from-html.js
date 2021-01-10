const JSDOM = require('jsdom').JSDOM;
const Readability = require('@mozilla/readability').Readability;

module.exports = html => {
  const dom = new JSDOM(html);
  const content = new Readability(dom.window.document).parse();

  return content;
};