import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const getProductStorage = () => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ceilo/products',
    format: async (req, file) => 'webp',
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  },
});

const getAvatarStorage = () => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ceilo/avatars',
    format: async (req, file) => 'webp',
    transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

export const uploadProductImages = (req, res, next) => {
  configureCloudinary();
  multer({
    storage: getProductStorage(),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).array('images', 10)(req, res, next);
};

export const uploadAvatar = (req, res, next) => {
  configureCloudinary();
  multer({
    storage: getAvatarStorage(),
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
  }).single('avatar')(req, res, next);
};

export const deleteCloudinaryImage = async (imageUrl) => {
  try {
    configureCloudinary();
    const parts    = imageUrl.split('/');
    const file     = parts[parts.length - 1].split('.')[0];
    const folder   = parts[parts.length - 2];
    const publicId = `${folder}/${file}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

export default cloudinary;