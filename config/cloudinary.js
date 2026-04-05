const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cielsko/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

const certStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cielsko/certificates',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
  },
});

const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cielsko/blog',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 630, crop: 'limit', quality: 'auto' }],
  },
});

const teamStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cielsko/team',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
});

const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cielsko/logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
  },
});

module.exports = {
  uploadProduct: multer({ storage: productStorage }),
  uploadCert:    multer({ storage: certStorage }),
  uploadBlog:    multer({ storage: blogStorage }),
  uploadTeam:    multer({ storage: teamStorage }),
  uploadLogo:    multer({ storage: logoStorage }),
  cloudinary,
};