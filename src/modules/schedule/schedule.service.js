// import { SCHEDULE_MODEL } from './schedule.model.js';
// import { OTMASTER_MODEL } from '../hospital_master/ot_master/ot_master.model.js';
// import { PATIENT_MODEL } from '../patient/patient.model.js';
// import { DOCTOR_MODEL } from '../doctor_master/doctor_master.model.js';
// import moment from 'moment';


// class ScheduleService {
//   async getAll() {
//     return await SCHEDULE_MODEL.find()
//     .populate('otId', 'otName')
//     .populate('patientId', 'admissionDetails.patientName')
//     .populate('doctorId', 'doctorName');
//   }

//    async create(data) {
//     const otExists = await OTMASTER_MODEL.findById(data.otId);
//     if (!otExists) throw this._error("Invalid OT ID: OT not found");

//     const patientExists = await PATIENT_MODEL.findById(data.patientId);
//     if (!patientExists) throw this._error("Invalid Patient ID: Patient not found");

//     const doctorExists = await DOCTOR_MODEL.findById(data.doctorId);
//     if (!doctorExists) throw this._error("Invalid Doctor ID: Doctor not found");

//     const startDateTime = moment(data.startDateTime, "YYYY-MM-DD hh:mm A").toISOString();
//     const endDateTime = moment(data.endDateTime, "YYYY-MM-DD hh:mm A").toISOString();

//     const newSchedule = new SCHEDULE_MODEL({
//       ...data,
//       startDateTime,
//       endDateTime
//     });

//     const savedSchedule = await newSchedule.save();

//     return await SCHEDULE_MODEL.findById(savedSchedule._id)
//       .populate('otId', 'otName')
//       .populate('doctorId', 'doctorName')
//       .populate('patientId', 'admissionDetails.patientName');
//   }



//   async deleteById(id) {
//     const deletedSchedule = await SCHEDULE_MODEL.findByIdAndDelete(id);
//     return deletedSchedule;
//   }

// async update(id, data) {
//     if (data.otId) {
//       const otExists = await OTMASTER_MODEL.findById(data.otId);
//       if (!otExists) throw this._error("Invalid OT ID: OT not found");
//     }

//     if (data.patientId) {
//       const patientExists = await PATIENT_MODEL.findById(data.patientId);
//       if (!patientExists) throw this._error("Invalid Patient ID: Patient not found");
//     }

//     if (data.doctorId) {
//       const doctorExists = await DOCTOR_MODEL.findById(data.doctorId);
//       if (!doctorExists) throw this._error("Invalid Doctor ID: Doctor not found");
//     }

//     if (data.startDateTime) {
//       data.startDateTime = moment(data.startDateTime, "YYYY-MM-DD hh:mm A").toISOString();
//     }

//     if (data.endDateTime) {
//       data.endDateTime = moment(data.endDateTime, "YYYY-MM-DD hh:mm A").toISOString();
//     }

//     const updatedSchedule = await SCHEDULE_MODEL.findByIdAndUpdate(id, data, {
//       new: true,
//     })
//       .populate('otId', 'otName')
//       .populate('patientId', 'admissionDetails.patientName')
//       .populate('doctorId', 'doctorName');

//     return updatedSchedule;
//   }

// async getSchedulesByOtId(otId) {
//   return await SCHEDULE_MODEL.find({ otId })
//     .populate('otId', 'otName')
//     .populate('patientId', 'admissionDetails.patientName')
//     .populate('doctorId', 'doctorName');
// }

// }

// export default new ScheduleService();

import moment from 'moment';
import { SCHEDULE_MODEL } from './schedule.model.js';
import { OTMASTER_MODEL } from '../hospital_master/ot_master/ot_master.model.js';
import { PATIENT_MODEL } from '../patient/patient.model.js';
import { DOCTOR_MODEL } from '../doctor_master/doctor_master.model.js';

class ScheduleService {
  async getAll() {
    const schedules = await SCHEDULE_MODEL.find()
      .populate('otId', 'otName')
      .populate('patientId', 'admissionDetails.patientName')
      .populate('doctorId', 'doctorName');

    return schedules.map(schedule => this._formatScheduleResponse(schedule));
  }

  async create(data) {
    const otExists = await OTMASTER_MODEL.findById(data.otId);
    if (!otExists) throw this._error("Invalid OT ID: OT not found");

    const patientExists = await PATIENT_MODEL.findById(data.patientId);
    if (!patientExists) throw this._error("Invalid Patient ID: Patient not found");

    const doctorExists = await DOCTOR_MODEL.findById(data.doctorId);
    if (!doctorExists) throw this._error("Invalid Doctor ID: Doctor not found");

    const startDateTime = moment(data.startDateTime, "YYYY-MM-DD hh:mm A").toISOString();
    const endDateTime = moment(data.endDateTime, "YYYY-MM-DD hh:mm A").toISOString();

    const newSchedule = new SCHEDULE_MODEL({
      ...data,
      startDateTime,
      endDateTime
    });

    const savedSchedule = await newSchedule.save();

    const populatedSchedule = await SCHEDULE_MODEL.findById(savedSchedule._id)
      .populate('otId', 'otName')
      .populate('doctorId', 'doctorName')
      .populate('patientId', 'admissionDetails.patientName');

    return this._formatScheduleResponse(populatedSchedule);
  }

  async deleteById(id) {
    return await SCHEDULE_MODEL.findByIdAndDelete(id);
  }

  async update(id, data) {
    if (data.otId) {
      const otExists = await OTMASTER_MODEL.findById(data.otId);
      if (!otExists) throw this._error("Invalid OT ID: OT not found");
    }

    if (data.patientId) {
      const patientExists = await PATIENT_MODEL.findById(data.patientId);
      if (!patientExists) throw this._error("Invalid Patient ID: Patient not found");
    }

    if (data.doctorId) {
      const doctorExists = await DOCTOR_MODEL.findById(data.doctorId);
      if (!doctorExists) throw this._error("Invalid Doctor ID: Doctor not found");
    }

    if (data.startDateTime) {
      data.startDateTime = moment(data.startDateTime, "YYYY-MM-DD hh:mm A").toISOString();
    }
    if (data.endDateTime) {
      data.endDateTime = moment(data.endDateTime, "YYYY-MM-DD hh:mm A").toISOString();
    }

    const updatedSchedule = await SCHEDULE_MODEL.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate('otId', 'otName')
      .populate('patientId', 'admissionDetails.patientName')
      .populate('doctorId', 'doctorName');

    return this._formatScheduleResponse(updatedSchedule);
  }

  async getSchedulesByOtId(otId) {
    const schedules = await SCHEDULE_MODEL.find({ otId })
      .populate('otId', 'otName')
      .populate('patientId', 'admissionDetails.patientName')
      .populate('doctorId', 'doctorName');

    return schedules.map(schedule => this._formatScheduleResponse(schedule));
  }

  _formatScheduleResponse(schedule) {
    const obj = schedule.toObject();
    obj.startDateTime = moment(obj.startDateTime).format("YYYY-MM-DD hh:mm A");
    obj.endDateTime = moment(obj.endDateTime).format("YYYY-MM-DD hh:mm A");
    return obj;
  }

  _error(message) {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
  }
}

export default new ScheduleService();
