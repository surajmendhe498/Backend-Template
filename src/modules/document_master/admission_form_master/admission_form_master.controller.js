import Admission_form_masterService from "./admission_form_master.service.js";
import { statusCode } from "../../../utils/constants/statusCode.js";

export default class Admission_form_masterController {
  constructor() {
    this.admission_form_masterService = Admission_form_masterService;
  }

  getAll = async (req, res, next) => {
    try {
      const patient = await this.admission_form_masterService.getAll();
      res.success("Get All Admission Fields", patient, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const createdField = await this.admission_form_masterService.create(req.body);
      res.success("Admission Field Created Successfully", createdField, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  search= async(req, res, next)=>{
    try {
      const data = await Admission_form_masterService.search(req.query);
      res.status(200).json({success: true, message: "Search results retrieved successfully", data });
      
    } catch (error) {
      next(err);
    }
  };

}
