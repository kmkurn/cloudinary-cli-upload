#!/usr/bin/env node

'use strict';

var yargs = require('yargs');

var uploader = require('./lib/uploader');
var version = require('./package.json').version;


var argv = yargs
  .usage('$0 [options] <file>...')
  .demand(1)
  .option('api-key', {
    alias: 'k',
    demand: false,
    describe: 'Cloudinary API key',
    type: 'string',
    nargs: 1
  })
  .option('api-secret', {
    alias: 's',
    demand: false,
    describe: 'Cloudinary API secret',
    type: 'string',
    nargs: 1
  })
  .option('cloud-name', {
    alias: 'n',
    demand: false,
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
    type: 'boolean'
  })
  .help('h')
  .alias('h', 'help')
  .example(
    '$0 --api-key 12345 --api-secret somesecret --cloud-name name ~/pics/*.jpg',
    'Upload all JPG images under ~/pics directory to Cloudinary'
  )
  .example(
    '$0 ~/pics/*.jpg',
    'Same as before but get the Cloudinary credential from CLOUDINARY_URL ' +
      'set in .env under current directory'
  )
  .version(version)
  .argv;

if (argv.apiKey && argv.apiSecret && argv.cloudName) {
  uploader.config({
    apiKey: argv.apiKey,
    apiSecret: argv.apiSecret,
    cloudName: argv.cloudName
  });
} else {
  console.info('One of API key, secret, or cloud name is not specified. Using .env instead.');
  require('dotenv').load();
}

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
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result);
  }
});
