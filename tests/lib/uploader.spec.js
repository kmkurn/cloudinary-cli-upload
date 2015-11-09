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
    context('when given the path to directory containing images', function () {
      var uploader = rewire('../../lib/uploader');

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

    context('when called with options', function () {
      var uploader = rewire('../../lib/uploader');

      var fakeImageFileNames = ['image1.jpg', 'image2.jpg'];
      var fakeOptions = {someKey: 'someValue'};

      var uploadStub;
      var readdirStub;

      before('setup spies, stubs, etc', function () {
        var cloudinary = uploader.__get__('cloudinary');
        var fs = uploader.__get__('fs');

        uploadStub = sinon.stub(cloudinary.uploader, 'upload', function (path, callback) {
          callback({some: 'result'});
        });

        readdirStub = sinon.stub(fs, 'readdirSync');
        readdirStub.returns(fakeImageFileNames);
      });

      after('tear down spies, stubs, etc', function () {
        uploadStub.restore();
        readdirStub.restore();
      });

      it('should call cloudinary upload API with the given options', function (done) {
        uploader.uploadImages('/path/to/dir', fakeOptions, function () {
          try {
            fakeImageFileNames.forEach(function (filename, index) {
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
