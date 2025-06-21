import Patient_masterService from "./patient_master.service.js";
import { statusCode } from '../../utils/constants/statusCode.js';

export default class Patient_masterController {
  constructor() {
    this.patient_masterService = Patient_masterService;
  }

  getAll = async (req, res, next) => {
    try {
      const patients = await this.patient_masterService.getAll();
      res.success("Fetched all patients successfully", patients, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
  create = async (req, res, next) => {
    try {
      const patientPhoto = req.file?.path; // Cloudinary URL
  
      const patientData = { ...req.body, patientPhoto }; // Add photo URL to patient data
  
      const newPatient = await this.patient_masterService.create(patientData);
  
      res.status(201).json({
        success: true,
        message: 'Patient created successfully',
        data: newPatient,
      });
    } catch (err) {
      next(err);
    }
  };
  
}
