import Referred_doctorService from "./referred_doctor.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Referred_doctorController {
  constructor() {
    this.referred_doctorService =  Referred_doctorService;
  }

  getAll = async (req, res, next) => {
    try {
          const referredDoctors= await this.referred_doctorService.getAll();

          if(referredDoctors.length == 0){
            return res.status(statusCode.NOT_FOUND).json({message: 'Referred doctor not found'});
          }

          res.status(statusCode.OK).json({message: 'Reffered doctors fetched successfully', data:referredDoctors});
      
    } catch (err) {
      next(err);
    }
  };

  create= async(req, res, next)=>{
    try {
      const referred_doctor= await this.referred_doctorService.create(req.body);
      res.status(statusCode.CREATED).json({message: 'Referred doctor added successfully', data:referred_doctor});
      
    } catch (error) {
      next(error);
    }
  }
}
