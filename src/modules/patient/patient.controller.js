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
    const patient = await this.patientService.create(req.body);
    res.success("Patient created successfully", patient, statusCode.CREATED);
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0]; 
      return res.status(400).json({
        message: `${duplicateField} value already exists. Please use a unique value.`,
      });
    }
    next(error); 
  }
};

  update = async (req, res, next) => {
    try {
      const { id } = req.params;

      const updatedPatient = await this.patientService.update(id, req.body);

      if (!updatedPatient) {
        return res.status(statusCode.NOT_FOUND).json({ message: 'Patient not found.' });
      }

      res.success('Patient updated successfully', updatedPatient, statusCode.OK);

    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0]; 
        return res.status(400).json({
          message: `${duplicateField} value already exists. Please use a unique value.`,
        });
      }
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
