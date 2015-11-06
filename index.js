'use strict';

var program = require('commander');

var createUploader = require('./lib/uploader');
var version = require('./package.json').version;

program
  .version(version)
  .usage('[options] <directory>')
  .description('Upload all images inside the given directory to Cloudinary')
  .option('--api-key', 'Cloudinary API key')
  .option('--api-secret', 'Cloudinary API secret')
  .option('--cloud-name', 'Cloudinary cloud name')
  .parse(process.argv);

var uploader = createUploader({
  apiKey: program.apiKey,
  apiSecret: program.apiSecret,
  cloudName: program.cloudName
});

if (program.args.length !== 1) {
  console.error('Exactly one directory containing images must be given');
  process.exit(1);
}

var directory = program.args[0];
uploader.upload(directory);
