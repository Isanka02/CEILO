import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

/**
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Storage: Products ────────────────────────────────────────────────────────
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'ceilo/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  },
});

// ─── Storage: Avatars ─────────────────────────────────────────────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'ceilo/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
});

// ─── File filter: images only ─────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

export const uploadProductImages = multer({
  storage:    productStorage,
  fileFilter,
  limits:     { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).array('images', 10); // up to 10 images

export const uploadAvatar = multer({
  storage:    avatarStorage,
  fileFilter,
  limits:     { fileSize: 2 * 1024 * 1024 }, // 2 MB
}).single('avatar');

/**
 * Delete a Cloudinary image by its URL.
 * Useful when replacing or deleting a product/avatar.
 */
export const deleteCloudinaryImage = async (imageUrl) => {
  try {
    // Extract public_id from URL: .../ceilo/products/filename.ext → ceilo/products/filename
    const parts   = imageUrl.split('/');
    const file    = parts[parts.length - 1].split('.')[0];
    const folder  = parts[parts.length - 2];
    const publicId = `${folder}/${file}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

export default cloudinary;