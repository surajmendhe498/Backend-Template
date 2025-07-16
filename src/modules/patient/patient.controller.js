import PatientService from './patient.service.js';
import { statusCode } from '../../utils/constants/statusCode.js';

export default class PatientController {
  constructor() {
    this.patientService = PatientService;
  }

  getAll = async (req, res, next) => {
    try {
      const patients = await this.patientService.getAll();

      if (patients.length === 0) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Patients not found' });
      }

      res.success('Fetched all patients successfully', patients, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { admissionDetails, identityDetails, ...otherData } = req.body;
      const files = req.files;

      const patientData = {
        ...otherData,
        admissionDetails: {
          ...admissionDetails,
          patientPhoto: files?.['admissionDetails[patientPhoto]']?.[0]?.path || null,
        },
        identityDetails: {
          ...identityDetails,
          aadharCardFrontImage: files?.['identityDetails[aadharCardFrontImage]']?.[0]?.path,
          aadharCardBackImage: files?.['identityDetails[aadharCardBackImage]']?.[0]?.path,
          panCardImage: files?.['identityDetails[panCardImage]']?.[0]?.path,
          healthCardImage: files?.['identityDetails[healthCardImage]']?.[0]?.path,
        },
      };

      const newPatient = await this.patientService.create(patientData);

      res.status(201).json({
        success: true,
        message: 'Patient created successfully',
        data: newPatient,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { admissionDetails, identityDetails, ...otherData } = req.body;
    const files = req.files;

    const updateData = {
      ...otherData,
      admissionDetails: {
        ...admissionDetails,
        patientPhoto: files?.['admissionDetails[patientPhoto]']?.[0]?.path || null,
      },
      identityDetails: {
        ...identityDetails,
        aadharCardFrontImage: files?.['identityDetails[aadharCardFrontImage]']?.[0]?.path,
        aadharCardBackImage: files?.['identityDetails[aadharCardBackImage]']?.[0]?.path,
        panCardImage: files?.['identityDetails[panCardImage]']?.[0]?.path,
        healthCardImage: files?.['identityDetails[healthCardImage]']?.[0]?.path,
      },
    };

    const updatedPatient = await this.patientService.update(id, updateData);

    if (!updatedPatient) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Patient not found.' });
    }

    res.success('Patient updated successfully', updatedPatient, statusCode.OK);
  } catch (error) {
    next(error);
  }
};

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;

      const patient = await this.patientService.getById(id);

      if (!patient) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Patient not found.' });
      }

      res.success('Patient fetched successfully', patient, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;

      const deletedPatient = await this.patientService.delete(id);

      if (!deletedPatient) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Patient not found.' });
      }

      res.success('Patient deleted successfully', deletedPatient, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
