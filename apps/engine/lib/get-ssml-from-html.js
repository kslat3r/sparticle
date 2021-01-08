const htmlToText = require('html-to-text');

module.exports = (siteName, title, byline, html, textSpeedPercentage = 90) => {
  const text = htmlToText.fromString(html, {
    preserveNewlines: true,
    noLinkBrackets: true,
    ignoreHref: true,
    ignoreImage: true,
    format: {
      heading: (elem, fn, options) => {
        const h = fn(elem.children, options);

        return `\n<break time="2s"/>\n${h.toUpperCase()}\n<break time="1s"/>`;
      },
      paragraph: (elem, fn, options) => {
        var h = fn(elem.children, options).replace(/</g, '');

        return h;
      }
    }
  })
  .replace(/>/gm, '')
  .replace(/s"\//gm, 's"/>')
  .replace(/&/g, ' and ')
  .replace(/orm-interview-snippet:/g, '')
  .replace(/orm:swap-title:/g, '');

  // add quotes

  return `
    <speak>
      <prosody rate="${textSpeedPercentage}%">
        ${siteName} - ${title}
        ${byline && byline !== '' && siteName !== byline ? `<break time="1s" />${byline}` : ''}
        <break time="2s" />
        ${text}
      </prosody>
    </speak>
  `;
};