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
      const patientPhoto = req.file?.path; 
  
      const patientData = { ...req.body, patientPhoto }; 
  
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

  search = async (req, res, next) => {
    try {
      const filters = req.query; 
      const patients = await this.patient_masterService.search(filters);
  
      res.success("Search results fetched successfully", patients, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

    getAdmittedPatients = async (req, res, next) => {
    try {
      const admittedPatients = await this.patient_masterService.search({ status: "Admitted" });

      if(admittedPatients.length == 0){
        return res.status(statusCode.NOT_FOUND).json({message: "No admitted patients found"});
      }

      res.success("Fetched admitted patients successfully", admittedPatients, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  getDischargedPatients = async (req, res, next) => {
    try {
      const dischargedPatients = await this.patient_masterService.search({ status: "Discharged" });

      if(dischargedPatients.length == 0){
        return res.status(statusCode.NOT_FOUND).json({message: "No discharged patients found"});
      }
      
      res.success("Fetched discharged patients successfully", dischargedPatients, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
  
}


