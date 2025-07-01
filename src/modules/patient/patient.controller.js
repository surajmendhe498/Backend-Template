import PatientService from './patient.service.js';
import { statusCode } from '../../utils/constants/statusCode.js';

export default class PatientController {
  constructor() {
    this.patientService = PatientService;
  }

  getAll = async (req, res, next) => {
    try {
      const patients = await this.patientService.getAll();

      if(patients.length == 0){
         return res.status(statusCode.NOT_FOUND).json({message: 'Patients not found'});
      }

      res.success('Fetched all patients successfully', patients, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
  try {
    const { admissionDetails, identityDetails, ...otherData } = req.body;
    const patientData = {
      ...otherData,
      admissionDetails: {
        ...admissionDetails,
        patientPhoto: req.file?.path, 
      },
      identityDetails,
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
}
