// const author = require('../config/s3.env.js');
const AWS = require('aws-sdk');
import {author} from './s3.env.js';
// const author = configS3.author;
const s3 = new AWS.S3({
  accessKeyId: author.accessKeyId,
  secretAccessKey: author.secretAccessKey,
  region: author.region
});

export async function s3upload (file, fileName, setModelLink) {
  const params = {
    Bucket: '3d-model-cdn', // pass your bucket name
    Key: fileName, // file will be saved as testBucket/contacts.csv
    ACL: 'public-read',
    Body: file
    // Body: JSON.stringify(data, null, 2),
  };
  let finalData = {};
  await s3.upload(params, function (s3Err, data) {
    if (s3Err) {
      console.log(s3Err, data);
      throw s3Err;
    }
    console.log(`File uploaded successfully at ${data.Location}`);
    const resData = {data: {name: fileName, link: data.Location}};
    finalData = resData;
    // console.log(resData);
    setModelLink(data.Location);
  });
  return finalData;

};
