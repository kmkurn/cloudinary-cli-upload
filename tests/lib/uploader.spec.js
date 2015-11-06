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
      var createUploader = rewire('../../lib/uploader');
      var uploader = createUploader({
        cloudName: 'some cloud name',
        apiKey: 'some api key',
        apiSecret: 'some api secret'
      });

      var fakePath = '/path/to/images/dir';
      var fakeImageFileNames = ['image1.jpg', 'image2.jpg'];
      var fakeUploadResult = {some: 'object'};

      var uploadStub;
      var readdirStub;
      var logSpy;
      var revertFn;

      before('setup spies, stubs, etc', function () {
        var cloudinary = createUploader.__get__('cloudinary');
        var fs = createUploader.__get__('fs');

        uploadStub = sinon.stub(cloudinary.uploader, 'upload', function (path, callback) {
          callback(fakeUploadResult);
        });

        readdirStub = sinon.stub(fs, 'readdirSync');
        readdirStub.returns(fakeImageFileNames);

        logSpy = sinon.spy();
        revertFn = createUploader.__set__({
          console: {
            log: logSpy
          }
        })
      });

      after('tear down spies, stubs, etc', function () {
        uploadStub.reset();
        readdirStub.restore();
        revertFn();
      });

      it('should upload to cloudinary', function () {
        uploader.upload(fakePath);

        expect(uploadStub).to.have.callCount(fakeImageFileNames.length);
        fakeImageFileNames.forEach(function (filename, index) {
          var fullPath = path.join(fakePath, filename);
          var spyCall = uploadStub.getCall(index);
          expect(spyCall).to.have.been.calledWith(fullPath);
        });
      });

      it('should print the upload result to stdout', function () {
        expect(logSpy).to.have.been.calledWithExactly(JSON.stringify(fakeUploadResult));
      });
    });
  });
});
