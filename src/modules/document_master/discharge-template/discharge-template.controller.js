import DischargeTemplateService from "./discharge-template.service.js";
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class DischargeTemplateController {
  constructor() {
    this.dischargeTemplateService = new DischargeTemplateService();
  }

  getAll = async (req, res, next) => {
    try {
      const templates = await this.dischargeTemplateService.getAll();
      res.status(statusCode.OK).json({ success: true, message: "Discharge Templates fetched successfully", data: templates });
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const newTemplate = await this.dischargeTemplateService.create(req.body);
      res.status(statusCode.CREATED).json({ success: true, message: "Discharge Template created successfully", data: newTemplate });
    } catch (err) {
      next(err);
    }
  };

  update= async(req, res, next)=>{
    try {
      const {id}= req.params;

      const updateTemplate= await this.dischargeTemplateService.update(id, req.body);
      if(!updateTemplate){
        return res.status(statusCode.NOT_FOUND).json({message: 'Discharge template not found'});
      }

      res.status(statusCode.OK).json({message: 'Discharge template updated successfully', updateTemplate});
      
    } catch (error) {
      next(error);
    }
  };

  delete= async(req, res, next)=>{
    try {
      const {id}= req.params;

      const deleteTemplate= await this.dischargeTemplateService.delete(id);
      if(!deleteTemplate){
        return res.status(statusCode.NOT_FOUND).json({message: 'Discharge template not found'});
      }

      res.status(statusCode.OK).json({message: 'Discharge template deleted successfully'});
      
    } catch (error) {
      next(error);
    }
  };

  
  getById = async (req, res, next) => {
    try {
      const template = await this.dischargeTemplateService.getById(req.params.id);

      if(!template){
        return res.status(statusCode.NOT_FOUND).json({message: 'Discharged template not found'});
      }

      res.status(statusCode.OK).json({ success: true, message: "Discharged Template fetched successfully", data: template });
    } catch (error) {
      next(error);
    }
  };
  
}
