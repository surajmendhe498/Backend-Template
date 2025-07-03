import Doctor_masterService from "./doctor_master.service.js";
 import { statusCode } from '../../utils/constants/statusCode.js';

export default class Doctor_masterController {
  constructor() {
    this.doctor_masterService =  Doctor_masterService;
  }

  getAll = async (req, res, next) => {
    try {
          const doctors= await this.doctor_masterService.getAll();
          if(doctors.length == 0){
            return res.status(statusCode.NOT_FOUND).json({message: 'Doctors not found'});
          }

          res.status(statusCode.OK).json({message: 'Doctors fetched successfully', data:doctors});
      
    } catch (err) {
      next(err);
    }
  };

  create= async(req, res, next)=>{
    try {
      const doctorData = req.body;

      if (doctorData.status) {
         doctorData.status = doctorData.status === "true";
      }

      if (req.file) {
        doctorData.photo = req.file.path; 
      }

      const doctor= await this.doctor_masterService.create(doctorData);
      res.status(statusCode.CREATED).json({message: 'Doctor added successfully', data:doctor});
      
    } catch (error) {
      next(error)
    }
  };

  getFilteredDoctors = async (req, res, next) => {
  try {
    const { department } = req.query; 
    const doctors = await this.doctor_masterService.filterByDepartment(department);

    res.status(200).json({
      success: true,
      message: "Filtered doctors fetched successfully",
      data: doctors,
    });
  } catch (err) {
    next(err);
  }
};

getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await this.doctor_masterService.getDoctorById(id);

    if (!doctor) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Doctor not found' });
    }

    res.status(statusCode.OK).json({
      success: true,
      message: 'Doctor fetched successfully',
      data: doctor,
    });
  } catch (err) {
    next(err);
  }
};

updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.status) {
      updateData.status = updateData.status === "true";
    }

    if (req.file) {
      updateData.photo = req.file.path;
    }

    const updatedDoctor = await this.doctor_masterService.updateDoctor(id, updateData);

    if (!updatedDoctor) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Doctor not found' });
    }

    res.status(statusCode.OK).json({
      success: true,
      message: 'Doctor updated successfully',
      data: updatedDoctor,
    });
  } catch (err) {
    next(err);
  }
};

deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await this.doctor_masterService.deleteDoctor(id);

    if (!deleted) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Doctor not found' });
    }

    res.status(statusCode.OK).json({
      success: true,
      message: 'Doctor deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};


}
