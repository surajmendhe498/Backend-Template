import { PATIENT_MODEL } from '../patient/patient.model.js';

class Reports_masterService {
  async getMonthlyReports(filters) {
    const query = {};

    if (filters?.month) {
      const startDate = new Date(`${filters.year || new Date().getFullYear()}-${filters.month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      query['admissionDetails.admissionDate'] = { $gte: startDate, $lt: endDate };
    }
    if (filters?.year && !filters?.month) {
      const startDate = new Date(`${filters.year}-01-01`);
      const endDate = new Date(`${filters.year}-12-31`);
      query['admissionDetails.admissionDate'] = { $gte: startDate, $lt: endDate };
    }
    if (filters?.patientStatus) {
      query['admissionDetails.patientStatus'] = filters.patientStatus;
    }
    if (filters?.gender) {
      query['admissionDetails.gender'] = filters.gender;
    }

    try {
      const patients = await PATIENT_MODEL.find(query).lean();

      return patients.map((patient) => {
        const admissionDate = patient.admissionDetails.admissionDate;
        const dischargeDate = patient.admissionDetails.dischargeDate;
        const timeOfAdmission = patient.admissionDetails.timeOfAdmission;
        const timeOfDischarge = patient.admissionDetails.timeOfDischarge;
        const duration = this.calculateDuration(admissionDate, dischargeDate, timeOfAdmission, timeOfDischarge);

        return {
          patientPhoto: patient.admissionDetails.patientPhoto,
          patientName: patient.admissionDetails.patientName,
          doctor: patient.admissionDetails.consultingDoctor,
          paymentMode: patient.admissionDetails.paymentMode,
          bedNo: patient.admissionDetails.bedName,
          admissionDate,
          dischargeDate,
          duration,
        };
      });
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      throw new Error('Failed to fetch monthly reports.');
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
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }

  async getReportsByDateRange({ fromDate, toDate, fromTime, toTime }) {
    const query = {};

    if (fromDate && toDate) {
      query['admissionDetails.admissionDate'] = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    if (fromTime && toTime) {
      query['admissionDetails.timeOfAdmission'] = {
        $gte: fromTime,
        $lte: toTime,
      };
    }

    try {
      const patients = await PATIENT_MODEL.find(query).lean();

      return patients.map((patient) => {
        const admissionDate = patient.admissionDetails.admissionDate;
        const dischargeDate = patient.admissionDetails.dischargeDate;
        const timeOfAdmission = patient.admissionDetails.timeOfAdmission;
        const timeOfDischarge = patient.admissionDetails.timeOfDischarge;
        const duration = this.calculateDuration(admissionDate, dischargeDate, timeOfAdmission, timeOfDischarge);

        return {
          patientPhoto: patient.admissionDetails.patientPhoto,
          patientName: patient.admissionDetails.patientName,
          doctor: patient.admissionDetails.consultingDoctor,
          paymentMode: patient.admissionDetails.paymentMode,
          bedNo: patient.admissionDetails.bedName,
          admissionDate,
          dischargeDate,
          duration,
        };
      });
    } catch (error) {
      console.error('Error fetching date range reports:', error);
      throw new Error('Failed to fetch date range reports.');
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
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }


  async getConsultantReports({ admissionDate, dischargeDate, mlcType, patientStatus }) {
    const query = {};

    if (admissionDate) {
      query['admissionDetails.admissionDate'] = new Date(admissionDate);
    }
    if (dischargeDate) {
      query['admissionDetails.dischargeDate'] = new Date(dischargeDate);
    }
    if (mlcType) {
      query['admissionDetails.mlc'] = mlcType === 'MLC';
    }
    if (patientStatus) {
      query['admissionDetails.patientStatus'] = patientStatus;
    }

    try {
      const patients = await PATIENT_MODEL.find(query).lean();

      return patients.map((patient) => {
        const admissionDate = patient.admissionDetails.admissionDate;
        const dischargeDate = patient.admissionDetails.dischargeDate;
        const timeOfAdmission = patient.admissionDetails.timeOfAdmission;
        const timeOfDischarge = patient.admissionDetails.timeOfDischarge;
        const duration = this.calculateDuration(admissionDate, dischargeDate, timeOfAdmission, timeOfDischarge);

        return {
          patientPhoto: patient.admissionDetails.patientPhoto,
          patientName: patient.admissionDetails.patientName,
          doctor: patient.admissionDetails.consultingDoctor,
          paymentMode: patient.admissionDetails.paymentMode,
          bedNo: patient.admissionDetails.bedName,
          admissionDate,
          dischargeDate,
          duration,
        };
      });
    } catch (error) {
      console.error('Error fetching consultant reports:', error);
      throw new Error('Failed to fetch consultant reports.');
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
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }
}

export default new Reports_masterService();
