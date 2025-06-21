import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js'; 

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'patient-images', 
    allowed_formats: ['jpeg', 'png'], 
    transformation: [{ width: 500, height: 500, crop: 'limit' }], 
  },
});

export const upload = multer({ storage });
