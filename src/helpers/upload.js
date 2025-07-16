import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const combinedStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = 'patient-images';
    const fieldName = file.fieldname;

    if (fieldName.includes('aadharCard')) folderName = 'aadhar-card-images';
    else if (fieldName.includes('panCard')) folderName = 'pan-card-images';
    else if (fieldName.includes('healthCard')) folderName = 'health-card-images';

    return {
      folder: folderName,
      allowed_formats: ['jpeg', 'png', 'webp'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    };
  },
});

const doctorStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'doctor-images',
    allowed_formats: ['jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const nurseStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nurse-images',
    allowed_formats: ['jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const uploadPatientAndIdentityImages = multer({ storage: combinedStorage }).fields([
  { name: 'admissionDetails[patientPhoto]', maxCount: 1 },
  { name: 'identityDetails[aadharCardFrontImage]', maxCount: 1 },
  { name: 'identityDetails[aadharCardBackImage]', maxCount: 1 },
  { name: 'identityDetails[panCardImage]', maxCount: 1 },
  { name: 'identityDetails[healthCardImage]', maxCount: 1 },
]);

const uploadDoctorImage = multer({ storage: doctorStorage });
const uploadNurseImage = multer({ storage: nurseStorage });

export {
  uploadPatientAndIdentityImages,
  uploadDoctorImage,
  uploadNurseImage,
};
