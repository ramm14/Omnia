const cloudinary = require('cloudinary').v2;

const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key:process.env.CLOUDINARY_APIKEY,
        api_secret:process.env.CLOUDINARY_SECRETKEY
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'OmniaUploads',
    format: async (req, file) => 'jpeg',
    public_id: (req, file) => 'computed-filename-using-request',
    transformation:[
      {
        width: 400,
        height: 400,
        crop: 'thumb',
        gravity: 'face',
        quality: 'auto',
        fetch_format: 'auto'
      }
    ]
  },
});

module.exports = { cloudinary , storage}