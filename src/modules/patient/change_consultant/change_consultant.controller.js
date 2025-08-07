import Change_consultantService from './change_consultant.service.js';
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Change_consultantController {
  constructor() {
    this.change_consultantService = Change_consultantService;
  }

  getAll = async (req, res, next) => {
    try {
      const result = await this.change_consultantService.getAll();
      res.success("Consultant change history fetched successfully", result, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  changeConsultant = async (req, res, next) => {
    try {
      const { patientId } = req.params;
      const {admissionId, consultingDoctor, changeDate, changeTime } = req.body;

      const updatedPatient = await this.change_consultantService.changeConsultant(patientId, {
        admissionId,
        consultingDoctor,
        changeDate,
        changeTime,
      });

      res.success('Consultant changed successfully', updatedPatient, statusCode.OK);
    } catch (err) {
      res.fail('Error changing consultant', err.message, statusCode.INTERNAL_SERVER_ERROR);
    }
  };

  getByPatientId = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const result = await this.change_consultantService.getByPatientId(patientId);
    res.success('Consultant change history fetched successfully', result, statusCode.OK);
  } catch (err) {
    res.fail('Error fetching consultant change history', err.message, statusCode.INTERNAL_SERVER_ERROR);
  }
};


getByPatientAndAdmissionId = async (req, res, next) => {
  try {
    const { patientId, admissionId } = req.params;
    const result = await this.change_consultantService.getByPatientAndAdmissionId(patientId, admissionId);
    res.success('Consultant change history fetched successfully', result, statusCode.OK);
  } catch (err) {
    res.fail('Error fetching consultant change history', err.message, statusCode.INTERNAL_SERVER_ERROR);
  }
};

}
