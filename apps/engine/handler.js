const AWS = require('aws-sdk');
const uuid = require('uuid').v4; 

const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-west-2'
});

const S3 = new AWS.S3();

module.exports.hello = async event => {
  const filename = `${uuid.v4()}.mp3`;

  let audio;
  
  try {
    audio = await Polly.synthesizeSpeech({
      OutputFormat: 'mp3',
      Text: 'Hello from Ed\'s text-to-speech engine!',
      TextType: 'text',
      VoiceId: 'Kimberly'
    }).promise();
  } catch (e) {
    console.error(e);

    return {
      statusCode: 500,
      body: JSON.stringify(e.message)
    };
  }

  let data;
  
  try {
    data = await S3.putObject({
      Bucket: 'sparticle-engine-prod-audio',
      Key: filename,
      Body: audio.AudioStream,
      ACL: 'public-read'
    }).promise();
  } catch (e) {
    console.error(e);

    return {
      statusCode: 500,
      body: JSON.stringify(e.message)
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      url: `https://sparticle-engine-prod-audio.s3.eu-west-2.amazonaws.com/${filename}`
    })
  };
  
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify(
  //     {
  //       message: 'Go Serverless v1.0! Your function executed successfully!',
  //       input: event,
  //     },
  //     null,
  //     2
  //   ),
  // };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
