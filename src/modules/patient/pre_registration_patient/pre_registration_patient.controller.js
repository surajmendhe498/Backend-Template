import Pre_registration_patientService from "./pre_registration_patient.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Pre_registration_patientController {
  constructor() {
    this.pre_registration_patientService =  Pre_registration_patientService;
  }

  create = async (req, res, next) => {
    try {
      const savedData = await Pre_registration_patientService.create(req.body);
      res.success('Pre-registration data saved successfully', savedData, statusCode.CREATED);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const allData = await Pre_registration_patientService.getAll();
      if(allData.length == 0){
        return res.status(statusCode.NOT_FOUND).json({message: 'No data found'});
      }
      res.success('Fetched pre-registration data', allData, statusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}
