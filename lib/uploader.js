'use strict';

var fs = require('fs');
var path = require('path');

var async = require('async');
var cloudinary = require('cloudinary');


exports.config = function (config) {
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret
  });
};

exports.uploadImages = function (imagesDir, callback) {
  var fullImagePaths = fs.readdirSync(imagesDir)
    .map(toFullPath.bind(null, imagesDir));

  async.map(fullImagePaths, uploadImage, callback);
};

function toFullPath(dirPath, filename) {
  return path.join(dirPath, filename);
}

function uploadImage(imagePath, callback) {
  cloudinary.uploader.upload(imagePath, callback.bind(null, null));
}
