import Nursing_masterService from "./nursing_master.service.js";
 import { statusCode } from '../../utils/constants/statusCode.js';

export default class Nursing_masterController {
  constructor() {
    this.nursing_masterService =  Nursing_masterService;
  }

  getAll = async (req, res, next) => {
    try {
           const nurses= await this.nursing_masterService.getAll();
           if(nurses.length == 0){
               return res.status(statusCode.NOT_FOUND).json({message: 'Nurses not found'});
           }

           res.status(statusCode.OK).json({message: 'Nurses fetched successfully', data:nurses});
      
    } catch (err) {
      next(err);
    }
  };

  create= async(req, res, next)=>{
    try {

      const nurseData= req.body;

      if (nurseData.status) {
         nurseData.status = nurseData.status === "true";
      }

      if (req.file) {
        nurseData.photo = req.file.path; 
      }

      const nurse= await this.nursing_masterService.create(nurseData);
      res.status(statusCode.CREATED).json({message: 'Nurse added successfully', data:nurse});
      
    } catch (error) {
      next(error);
    }
  };

  filterByDepartment = async (req, res, next) => {
  try {
    const { department } = req.query;

    if (!department) {
      return res.status(statusCode.BAD_REQUEST).json({
        message: "Department query parameter is required",
      });
    }

    const filteredNurses = await this.nursing_masterService.filterByDepartment(department);

    if (filteredNurses.length === 0) {
      return res.status(statusCode.NOT_FOUND).json({
        message: "No nurses found in the specified department",
        data: [],
      });
    }

    return res.status(statusCode.OK).json({
      message: "Nurses fetched successfully",
      data: filteredNurses,
    });

  } catch (err) {
    next(err);
  }
};

getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const nurse = await this.nursing_masterService.getById(id);

    if (!nurse) {
      return res.status(statusCode.NOT_FOUND).json({ message: "Nurse not found" });
    }

    res.status(statusCode.OK).json({ message: "Nurse fetched successfully", data: nurse });
  } catch (err) {
    next(err);
  }
};

update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.status) {
      updateData.status = updateData.status === "true";
    }

    if (req.file) {
      updateData.photo = req.file.path;
    }

    const updatedNurse = await this.nursing_masterService.update(id, updateData);

    if (!updatedNurse) {
      return res.status(statusCode.NOT_FOUND).json({ message: "Nurse not found" });
    }

    res.status(statusCode.OK).json({ message: "Nurse updated successfully", data: updatedNurse });
  } catch (err) {
    next(err);
  }
};

delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedNurse = await this.nursing_masterService.delete(id);

    if (!deletedNurse) {
      return res.status(statusCode.NOT_FOUND).json({ message: "Nurse not found" });
    }

    res.status(statusCode.OK).json({ message: "Nurse deleted successfully" });
  } catch (err) {
    next(err);
  }
};

}
