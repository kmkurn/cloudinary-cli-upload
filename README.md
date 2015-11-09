# cloudinary-cli-upload

Simple CLI to upload images to Cloudinary

## Installation

```javascript
npm install -g cloudinary-cli-upload
```

## Usage

To upload JPG files under `~/pics/` directory

```bash
cloudinary-upload --api-key 12345 --api-secret somesecret --cloud-name somename ~/pics/*.jpg
```

If Cloudinary credential is not specified, `.env` file under current directory will be loaded. `CLOUDINARY_URL` environment variable must be set in the file as this will be used as configuration.

Run `cloudinary-upload -h` for more options.
