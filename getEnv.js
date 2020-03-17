'use strict';

const fs = require('fs');

const dotEnvExists = fs.existsSync('.env');
if (dotEnvExists) {
  console.log('getEnv.js: .env exists. probably running on development');
  process.exit();
}

const gcs = require('@google-cloud/storage')();

const bucketName = 'envars-stjohndevsales';
console.log(`getEnv.js: Downloading .env from bucket: "${bucketName}"`);
gcs
  .bucket(bucketName)
  .file('.env')
  .download({destination: '.env'})
  .then(() => {
    console.log('getEnv.js: .env downloaded successfully!');
  })
  .catch(e => {
    console.error(`getEnv.js: There was an Error downloading the .env file: ${JSON.stringify(e, undefined, 2)}`);
  });
