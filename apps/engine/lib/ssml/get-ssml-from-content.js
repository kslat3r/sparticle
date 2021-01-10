const htmlToText = require('html-to-text');

module.exports = (content, textSpeedPercentage = 90) => {
  const {
    siteName,
    title,
    byline,
    content: html
  } = content;

  const text = htmlToText.fromString(html, {
    preserveNewlines: false,
    ignoreHref: true,
    ignoreImage: true,
    formatters: {
      heading: (elem, walk, builder) => {
        builder.openBlock(2);
        builder.addInline('<break time="2s" />');
        walk(elem.children, builder);
        builder.addInline('<break time="1s" />');
        builder.closeBlock(2);
      },
      blockquote: (elem, walk, builder) => {
        builder.openBlock(2);
        builder.addInline('<emphasis level="reduced">')
        walk(elem.children, builder);
        builder.addInline('</emphasis>')
        builder.closeBlock(2);
      },
      table: () => {}
    }
  });

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