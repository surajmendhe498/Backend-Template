import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user-photos',  
    allowed_formats: ['jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const uploadUserImage = multer({ storage: userStorage });

export {
  uploadUserImage,
};
