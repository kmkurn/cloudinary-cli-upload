'use strict';

var yargs = require('yargs');

var uploader = require('./lib/uploader');
var version = require('./package.json').version;


var argv = yargs
  .usage('$0 [options] <directory>')
  .demand(1, 1)
  .option('api-key', {
    demand: true,
    describe: 'Cloudinary API key',
    type: 'string',
    nargs: 1
  })
  .option('api-secret', {
    demand: true,
    describe: 'Cloudinary API secret',
    type: 'string',
    nargs: 1
  })
  .option('cloud-name', {
    demand: true,
    describe: 'Cloudinary cloud name',
    type: 'string',
    nargs: 1
  })
  .option('f', {
    alias: 'folder',
    demand: false,
    describe: 'Cloudinary image folder',
    type: 'string',
    nargs: 1
  })
  .help('h')
  .alias('h', 'help')
  .example('$0 --api-key 12345 --api-secret somesecret --cloud-name name ~/pics',
           'Upload all images under ~/pics directory to Cloudinary')
  .version(version)
  .argv;

uploader.config({
  apiKey: argv.apiKey,
  apiSecret: argv.apiSecret,
  cloudName: argv.cloudName
});

function logError(e) {
  if (e instanceof Error) {
    return e.stack;
  }
  return JSON.stringify(e);
}

var imagesDir = argv._[0];
var options = {
  folder: argv.folder
};

uploader.uploadImages(imagesDir, options, function (err, result) {
  if (err) {
    console.error(logError(err));
  } else {
    console.log(result);
  }
});
