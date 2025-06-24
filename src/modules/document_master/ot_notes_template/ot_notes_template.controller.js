import Ot_notes_templateService from "./ot_notes_template.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Ot_notes_templateController {
  constructor() {
    this.ot_notes_templateService =  Ot_notes_templateService;
  }

  getAll = async (req, res, next) => {
    try {
      const templates = await this.ot_notes_templateService.getAll();
      res.status(statusCode.OK).json({ success: true, message: "Templates fetched successfully", data: templates });
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const newTemplate = await this.ot_notes_templateService.create(req.body);
      res.status(statusCode.CREATED).json({ success: true, message: "Template created successfully", data: newTemplate });
    } catch (err) {
      next(err);
    }
  };

  update= async(req, res, next)=>{
    try {
      const {id}= req.params;

      const updateTemplate= await this.ot_notes_templateService.update(id, req.body);
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

      const deleteTemplate= await this.ot_notes_templateService.delete(id);
      if(!deleteTemplate){
        return res.status(statusCode.NOT_FOUND).json({message: 'Discharge template not found'});
      }

      res.status(statusCode.OK).json({message: 'Discharge template deleted successfully'});
      
    } catch (error) {
      next(error);
    }
  };

  search = async (req, res, next) => {
    try {
      const templates = await this.ot_notes_templateService.search(req.query);
      res.status(statusCode.OK).json({ success: true, message: "Search results", data: templates });
    } catch (error) {
      next(error);
    }
  };
}
