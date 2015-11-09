'use strict';

var program = require('commander');

var uploader = require('./lib/uploader');
var version = require('./package.json').version;

var imagesDir;


program
  .version(version)
  .description('Upload all images inside the given directory to Cloudinary')
  .arguments('<directory>')
  .action(function (directory) {
    imagesDir = directory;
  })
  .option('--api-key', 'Cloudinary API key')
  .option('--api-secret', 'Cloudinary API secret')
  .option('--cloud-name', 'Cloudinary cloud name')
  .parse(process.argv);

uploader.config({
  apiKey: program.apiKey,
  apiSecret: program.apiSecret,
  cloudName: program.cloudName
});

if (typeof imagesDir === 'undefined') {
  console.error('Exactly one directory containing images must be given');
  process.exit(1);
}

function logError(e) {
  if (e instanceof Error) {
    return e.stack;
  }
  return JSON.stringify(e);
}

uploader.uploadImages(imagesDir, function (err, result) {
  if (err) {
    console.error(logError(err));
  } else {
    console.log(result);
  }
});
