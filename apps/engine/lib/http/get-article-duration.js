const axios = require('axios');
const fs = require('fs');
const mp3Duration = require('mp3-duration');

const audioFile = '/tmp/audio.mp3';

module.exports = async article => {
  const response = await axios({
    method: 'GET',
    url: article.s3ObjectUrl,
    responseType: 'stream'
  });

  response.data.pipe(fs.createWriteStream(audioFile));

  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve(mp3Duration(audioFile));
    });

    response.data.on('error', e => reject(e));
  });
}