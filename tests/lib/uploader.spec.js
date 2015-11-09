'use strict';

var path = require('path');

var chai = require('chai');
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);
var expect = chai.expect;

describe('lib/uploader.js', function () {
  describe('.config()', function () {
    context('when called with a config object', function () {
      var uploader = rewire('../../lib/uploader');
      var fakeConfig = {
        apiKey: 'some api key',
        apiSecret: 'some api secret',
        cloudName: 'some cloud name'
      };

      var configSpy;

      before('setup spies, stubs, etc', function () {
        var cloudinary = uploader.__get__('cloudinary');
        configSpy = sinon.spy(cloudinary, 'config');
      });

      after('tear down spies, stubs, etc', function () {
        configSpy.reset();
      });

      it('should call cloudinary config method with the same config object', function () {
        uploader.config(fakeConfig);

        expect(configSpy).to.be.calledWithExactly({
          api_key: fakeConfig.apiKey,
          api_secret: fakeConfig.apiSecret,
          cloud_name: fakeConfig.cloudName
        });
      });
    });

    context('when called with an incomplete config object', function () {
      var uploader = rewire('../../lib/uploader');
      var fakeConfig = {
        apiKey: 'some api key',
        apiSecret: 'some api secret'
      };

      it('should throw error', function () {
        var fn = uploader.config.bind(uploader, fakeConfig);
        expect(fn).to.throw;
      });
    });
  });

  describe('.uploadImages()', function () {
    context('when given an array of paths to images', function () {
      var uploader = rewire('../../lib/uploader');

      var fakeImages = ['/path/to/dir/image1.jpg', '/path/to/dir/image2.jpg'];
      var fakeUploadResult = {some: 'object'};

      var uploadStub;

      before('setup spies, stubs, etc', function () {
        var cloudinary = uploader.__get__('cloudinary');

        uploadStub = sinon.stub(cloudinary.uploader, 'upload', function (path, callback) {
          callback(fakeUploadResult);
        });
      });

      after('tear down spies, stubs, etc', function () {
        uploadStub.restore();
      });

      it('should upload to cloudinary', function (done) {
        uploader.uploadImages(fakeImages, function () {
          try {
            expect(uploadStub).to.have.callCount(fakeImages.length);
            fakeImages.forEach(function (imagePath, index) {
              var spyCall = uploadStub.getCall(index);
              expect(spyCall).to.have.been.calledWith(
                imagePath,
                sinon.match.func
              );
            });
          } catch (e) {
            return done(e);
          }
          done();
        });
      });

      it('should call the callback with augmented upload results', function (done) {
        uploader.uploadImages(fakeImages, function (err, result) {
          var toAugmentedUploadResult = function (imagePath) {
            return {
              name: path.basename(imagePath),
              url: path.resolve(imagePath),
              cloudinaryData: fakeUploadResult
            };
          };
          var expected = fakeImages.map(toAugmentedUploadResult);

          try {
            expect(err).to.be.null;
            expect(result).to.deep.equal(expected);
          } catch (e) {
            return done(e);
          }
          done();
        });
      });
    });

    context('when called with options', function () {
      var uploader = rewire('../../lib/uploader');

      var fakeImages = ['/path/to/dir/image1.jpg', '/path/to/dir/image2.jpg'];
      var fakeOptions = {someKey: 'someValue'};

      var uploadStub;

      before('setup spies, stubs, etc', function () {
        var cloudinary = uploader.__get__('cloudinary');

        uploadStub = sinon.stub(cloudinary.uploader, 'upload', function (path, callback) {
          callback({some: 'result'});
        });
      });

      after('tear down spies, stubs, etc', function () {
        uploadStub.restore();
      });

      it('should call cloudinary upload API with the given options', function (done) {
        uploader.uploadImages(fakeImages, fakeOptions, function () {
          try {
            fakeImages.forEach(function (imagePath, index) {
              var spyCall = uploadStub.getCall(index);
              expect(spyCall).to.have.been.calledWith(
                sinon.match.string,
                sinon.match.func,
                fakeOptions
              );
            });
          } catch (e) {
            return done(e);
          }
          done();
        });
      });
    });
  });
});
