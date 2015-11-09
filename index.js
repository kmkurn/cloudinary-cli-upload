'use strict';

var yargs = require('yargs');

var uploader = require('./lib/uploader');
var version = require('./package.json').version;


var argv = yargs
  .usage('$0 [options] <directory>')
  .demand(1)
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
  .option('json', {
    demand: false,
    describe: 'Print result as JSON',
    type: 'boolean',
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

var images = argv._;
var options = {
  folder: argv.folder
};

uploader.uploadImages(images, options, function (err, result) {
  if (err) {
    return console.error(logError(err));
  }

  if (argv.json) {
    console.log(JSON.stringify(result));
  } else {
    console.log(result);
  }
});
