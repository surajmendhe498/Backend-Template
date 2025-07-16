// import { PATIENT_MODEL } from '../patient/patient.model.js';

// class PatientMasterService {
//   async getAll(filters) {
//     const query = {};

//     if (filters?.patientStatus) {
//       query['admissionDetails.patientStatus'] = filters.patientStatus;
//     }
//     if (filters?.floorDetails) {
//       query['admissionDetails.floorDetails'] = filters.floorDetails;
//     }
//     if (filters?.paymentMode) {
//       query['admissionDetails.paymentMode'] = filters.paymentMode;
//     }
//     if (filters?.dischargeSummaryStatus) {
//       query['admissionDetails.dischargeSummaryStatus'] = filters.dischargeSummaryStatus;
//     }
//     if (filters?.admissionDate) {
//       query['admissionDetails.admissionDate'] = { $gte: new Date(filters.admissionDate) };
//     }
//     if (filters?.dischargeDate) {
//       query['admissionDetails.dischargeDate'] = { $lte: new Date(filters.dischargeDate) };
//     }
//     if (filters?.admissionReason) {
//       query['admissionDetails.reasonForAdmission'] = { $regex: filters.admissionReason, $options: 'i' };
//     }
//     if (filters?.consultant) {
//       query['admissionDetails.otherConsultant'] = { $regex: filters.consultant, $options: 'i' };
//     }

//     try {
//       const patients = await PATIENT_MODEL.find(query).lean();

//       return patients.map((patient) => {
//         const admissionDate = patient.admissionDetails.admissionDate;
//         const dischargeDate = patient.admissionDetails.dischargeDate;
//         const timeOfAdmission = patient.admissionDetails.timeOfAdmission;
//         const timeOfDischarge = patient.admissionDetails.timeOfDischarge;
//         const duration = this.calculateDuration(admissionDate, dischargeDate, timeOfAdmission, timeOfDischarge);

//         return {
//           patientPhoto: patient.admissionDetails.patientPhoto,
//           patientName: patient.admissionDetails.patientName,
//           doctor: patient.admissionDetails.consultingDoctor,
//           paymentMode: patient.admissionDetails.paymentMode,
//           bedNo: patient.admissionDetails.bedName,
//           admissionDate,
//           dischargeDate,
//           duration,
//         };
//       });
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//       throw new Error('Failed to fetch patient records.');
//     }
//   }

//   calculateDuration(admissionDate, dischargeDate, timeOfAdmission, timeOfDischarge) {
//     if (!admissionDate || !dischargeDate) return 'N/A';

//     const admission = new Date(`${admissionDate.toISOString().split('T')[0]}T${this.formatTimeToISO(timeOfAdmission)}`);
//     const discharge = new Date(`${dischargeDate.toISOString().split('T')[0]}T${this.formatTimeToISO(timeOfDischarge)}`);

//     const diffMs = discharge - admission;

//     const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

//     return `${days} Days ${hours} Hours ${minutes} Minutes`;
//   }

//   formatTimeToISO(time) {
//     const [timePart, modifier] = time.split(' ');
//     let [hours, minutes] = timePart.split(':').map(Number);

//     if (modifier === 'PM' && hours !== 12) hours += 12;
//     if (modifier === 'AM' && hours === 12) hours = 0;

//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
//   }
// }

// export default new PatientMasterService();





import { PATIENT_MODEL } from '../patient/patient.model.js';
import mongoose from 'mongoose';

class PatientMasterService {
  async getAll(filters) {
    const query = {};

    if (filters?.patientStatus) {
      query['admissionDetails.patientStatus'] = filters.patientStatus;
    }
    if (filters?.floorDetails) {
      query['admissionDetails.floorDetails'] = filters.floorDetails;
    }
    if (filters?.paymentMode) {
      query['admissionDetails.paymentMode'] = filters.paymentMode;
    }
    if (filters?.dischargeSummaryStatus) {
      query['admissionDetails.dischargeSummaryStatus'] = filters.dischargeSummaryStatus;
    }
    if (filters?.admissionDate) {
      query['admissionDetails.admissionDate'] = { $gte: new Date(filters.admissionDate) };
    }
    if (filters?.dischargeDate) {
      query['admissionDetails.dischargeDate'] = { $lte: new Date(filters.dischargeDate) };
    }
  if (filters?.reasonForAdmission) {
  if (!mongoose.Types.ObjectId.isValid(filters.reasonForAdmission)) {
   
    return []; 
  }
  const exists = await mongoose.model('admission-reason').exists({ _id: filters.reasonForAdmission });

  if (!exists) {
    return [];
  }

  query['admissionDetails.reasonForAdmission'] = new mongoose.Types.ObjectId(filters.reasonForAdmission);
}
    if (filters?.consultant) {
      query['admissionDetails.otherConsultant'] = { $regex: filters.consultant, $options: 'i' };
    }

    try {
      const patients = await PATIENT_MODEL.find(query)
        .populate('admissionDetails.bedName', 'bedName')
        .populate('admissionDetails.consultingDoctor', 'doctorName')
        .lean();

      return patients.map((patient) => {
        const admissionDate = patient.admissionDetails.admissionDate;
        const dischargeDate = patient.admissionDetails.dischargeDate;
        const timeOfAdmission = patient.admissionDetails.timeOfAdmission;
        const timeOfDischarge = patient.admissionDetails.timeOfDischarge;
        const duration = this.calculateDuration(admissionDate, dischargeDate, timeOfAdmission, timeOfDischarge);

        return {
          patientPhoto: patient.admissionDetails.patientPhoto,
          patientName: patient.admissionDetails.patientName,
           doctor: patient.admissionDetails.consultingDoctor?.doctorName || 'N/A',
          paymentMode: patient.admissionDetails.paymentMode,
          bedNo: patient.admissionDetails.bedName?.bedName || 'N/A',
          admissionDate,
          dischargeDate,
          duration,
        };
      });
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw new Error('Failed to fetch patient records.');
    }
  }

  calculateDuration(admissionDate, dischargeDate, timeOfAdmission, timeOfDischarge) {
    if (!admissionDate || !dischargeDate) return 'N/A';

    const admission = new Date(`${admissionDate.toISOString().split('T')[0]}T${this.formatTimeToISO(timeOfAdmission)}`);
    const discharge = new Date(`${dischargeDate.toISOString().split('T')[0]}T${this.formatTimeToISO(timeOfDischarge)}`);

    const diffMs = discharge - admission;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} Days ${hours} Hours ${minutes} Minutes`;
  }

  formatTimeToISO(time) {
    if (!time) return '00:00:00';

    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }
}

export default new PatientMasterService();
