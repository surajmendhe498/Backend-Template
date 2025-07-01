import { PATIENT_MODEL } from '../../patient/patient.model.js';

class Ipd_patient_detailsService {

   async getFilteredIpdPatients(filters) {
    const query = { registrationType: 'IPD' };

    if (filters.patientStatus) query['admissionDetails.patientStatus'] = filters.patientStatus;
    if (filters.admissionDate) query['admissionDetails.admissionDate'] = { $gte: new Date(filters.admissionDate) };
    if (filters.consultant) query['admissionDetails.otherConsultant'] = { $regex: filters.consultant, $options: 'i' };
    if (filters.floorDetails) query['admissionDetails.floorDetails'] = filters.floorDetails;

    const patients = await PATIENT_MODEL.find(query).lean();

    return patients.map(patient => ({
      patientName: patient.admissionDetails.patientName,
      uhidNo: patient.admissionDetails.uhidNo,
      ipdNo: patient.admissionDetails.IPD,
      bedNo: patient.admissionDetails.bedName,
      gender: patient.admissionDetails.gender,
      doctor: patient.admissionDetails.consultingDoctor,
      contactNo: `${patient.admissionDetails.contactNo}, ${patient.admissionDetails.whatsappNo}`,
      admissionDate: patient.admissionDetails.admissionDate,
      dischargeDate: patient.admissionDetails.dischargeDate,
    }));
  }
}

export default new Ipd_patient_detailsService();

