'use strict';

var path = require('path');

var chai = require('chai');
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);
var expect = chai.expect;

describe('lib/uploader.js', function () {
  describe('.uploadImages()', function () {
    context('when given the path to directory containing images', function () {
      var uploader = rewire('../../lib/uploader');
      uploader.config({
        cloudName: 'some cloud name',
        apiKey: 'some api key',
        apiSecret: 'some api secret'
      });

      var fakePath = '/path/to/images/dir';
      var fakeImageFileNames = ['image1.jpg', 'image2.jpg'];
      var fakeUploadResult = {some: 'object'};

      var uploadStub;
      var readdirStub;

      before('setup spies, stubs, etc', function () {
        var cloudinary = uploader.__get__('cloudinary');
        var fs = uploader.__get__('fs');

        uploadStub = sinon.stub(cloudinary.uploader, 'upload', function (path, callback) {
          callback(fakeUploadResult);
        });

        readdirStub = sinon.stub(fs, 'readdirSync');
        readdirStub.returns(fakeImageFileNames);
      });

      after('tear down spies, stubs, etc', function () {
        uploadStub.restore();
        readdirStub.restore();
      });

      it('should upload to cloudinary', function (done) {
        uploader.uploadImages(fakePath, function () {
          try {
            expect(uploadStub).to.have.callCount(fakeImageFileNames.length);
            fakeImageFileNames.forEach(function (filename, index) {
              var fullPath = path.join(fakePath, filename);
              var spyCall = uploadStub.getCall(index);
              expect(spyCall).to.have.been.calledWith(fullPath);
            });
          } catch (e) {
            return done(e);
          }
          done();
        });
      });

      it('should call the callback with the upload results', function (done) {
        uploader.uploadImages(fakePath, function (err, result) {
          try {
            expect(err).to.be.null;
            expect(result).to.deep.equal([fakeUploadResult, fakeUploadResult])
          } catch (e) {
            return done(e);
          }
          done();
        });
      });
    });
  });
});
