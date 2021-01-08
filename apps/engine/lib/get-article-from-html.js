const JSDOM = require('jsdom').JSDOM;
const Readability = require('@mozilla/readability').Readability;

module.exports = html => {
  const dom = new JSDOM(html);
  const article = new Readability(dom.window.document).parse();

  return article;
};