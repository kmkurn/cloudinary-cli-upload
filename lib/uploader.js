'use strict';

var fs = require('fs');
var path = require('path');

var async = require('async');
var cloudinary = require('cloudinary');


exports.config = function (config) {
  cloudinary.config({
    // jscs:disable
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret
    // jscs:enable
  });
};

function toFullPath(dirPath, filename) {
  return path.join(dirPath, filename);
}

function uploadImage(options, imagePath, callback) {
  cloudinary.uploader.upload(imagePath, callback.bind(null, null), options);
}

exports.uploadImages = function (imagesDir, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var fullImagePaths = fs.readdirSync(imagesDir)
    .map(toFullPath.bind(null, imagesDir));

  async.mapLimit(fullImagePaths, 10, uploadImage.bind(null, options), callback);
};
