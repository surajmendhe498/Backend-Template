import PatientService from "./patient.service.js";
 import { statusCode } from '../../utils/constants/statusCode.js';

export default class PatientController {
  constructor() {
    this.patientService =  PatientService;
  }

  getAll = async (req, res, next) => {
    try {
        const patients= await this.patientService.getAll();
        if(patients.length == 0){
          return res.status(statusCode.NOT_FOUND).json({message: 'Patients not found'});
        }
    
        res.success('Fetched all patients successfully', patients, statusCode.OK);
      
    } catch (err) {
      next(err);
    }
  };

  create= async(req, res, next)=>{
    try {
      const patient= await this.patientService.create(req.body);
      res.success("Patient created successfully", patient, statusCode.CREATED);
      
    } catch (error) {
      next(error);
    }
  };

  update= async(req, res, next)=>{
    try {
      const {id}= req.params;

      const updatePatient= await this.patientService.update(id, req.body);
      if(!updatePatient){
         return res.status(statusCode.NOT_FOUND).json({message: 'Patient not found'});
      }

      res.success('Patient updated successfully', updatePatient, statusCode.OK);
      
    } catch (error) {
      next(error);
    }
  };

  delete= async(req, res, next)=>{
    try {
      const {id}= req.params;

      const deletePatient= await this.patientService.delete(id);
      if(!deletePatient){
          return res.status(statusCode.NOT_FOUND).json({message: 'Patient not found'});
      }

      res.success('Patient deleted successfully', statusCode.OK);
      
    } catch (error) {
      next(err);
    }
  };

  getById= async(req, res, next)=>{
    try {
      const {id}= req.params;

      const patient= await this.patientService.getById(id);
      if(!patient){
        return res.status(statusCode.NOT_FOUND).json({message: 'Patient not found'});
      }

      res.success('Patient fetched successfully', patient, statusCode.OK)
      
    } catch (error) {
      next(err);
    }
  };
}
