import { CONSULTANT_CHANGE_MODEL } from './change_consultant.model.js';
import { PATIENT_MODEL } from '../patient.model.js';
import { DOCTOR_MODEL } from '../../doctor_master/doctor_master.model.js';

class Change_consultantService {
  async changeConsultant(patientId, { consultingDoctor, changeDate, changeTime }) {
    const doctor = await DOCTOR_MODEL.findById(consultingDoctor);
    if (!doctor) {
      throw new Error('Consulting doctor not found');
    }

    const patient = await PATIENT_MODEL.findOneAndUpdate(
      { _id: patientId },
      { 'admissionDetails.consultingDoctor': doctor._id },
      { new: true }
    );

    if (!patient) {
      throw new Error('Patient not found');
    }

    const changeEntry = await CONSULTANT_CHANGE_MODEL.create({
      patientId,
      consultingDoctorName: doctor.doctorName,
      changeDate,
      changeTime,
    });

    const fullPatient = await PATIENT_MODEL.findById(patientId)
      .populate('admissionDetails.reasonForAdmission', 'admissionReason')
      .populate('admissionDetails.floorDetails', 'floorName')
      .populate('admissionDetails.bedName', 'bedName')
      .populate('admissionDetails.consultingDoctor', 'doctorName')
      .populate('admissionDetails.referredByDoctor', 'doctorName');

    return {
      ...fullPatient.toObject(),
      changeDate: changeEntry.changeDate,
      changeTime: changeEntry.changeTime
    };
  }

  async getAll() {
    return await CONSULTANT_CHANGE_MODEL.find().sort({ createdAt: -1 });
  }

  async getByPatientId(patientId) {
  return await CONSULTANT_CHANGE_MODEL.find({ patientId })
    .sort({ createdAt: -1 })
}

}

export default new Change_consultantService();
