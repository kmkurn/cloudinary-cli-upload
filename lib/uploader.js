'use strict';

var fs = require('fs');
var path = require('path');

var async = require('async');
var cloudinary = require('cloudinary');

function writeResult(result) {
  console.log(JSON.stringify(result));
}

function uploadImage(imagePath, callback) {
  cloudinary.uploader.upload(imagePath, function (result) {
    writeResult(result);
    callback();
  });
}

function uploadImages(imagesDir) {
  var fullImagePaths = fs.readdirSync(imagesDir)
    .map(function (filename) {
      return path.join(imagesDir, filename);
    });

  async.each(fullImagePaths, uploadImage);
}

module.exports = function (config) {
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret
  });

  return {
    upload: uploadImages
  };
};
