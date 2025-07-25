import { SCHEDULE_MODEL } from './schedule.model.js';
import { OTMASTER_MODEL } from '../hospital_master/ot_master/ot_master.model.js';

class ScheduleService {
  async getAll() {
    return await SCHEDULE_MODEL.find().populate('otId', 'otName');
  }

  async create(data) {
    const otExists = await OTMASTER_MODEL.findById(data.otId);
    if (!otExists) {
      const error = new Error("Invalid OT ID: OT not found");
      error.statusCode = 404;
      throw error;
    }

    const newSchedule = new SCHEDULE_MODEL(data);
    return await newSchedule.save();
  }

  async deleteById(id) {
    const deletedSchedule = await SCHEDULE_MODEL.findByIdAndDelete(id);
    return deletedSchedule;
  }

  async update(id, data) {
  if (data.otId) {
    const otExists = await OTMASTER_MODEL.findById(data.otId);
    if (!otExists) {
      const error = new Error("Invalid OT ID: OT not found");
      error.statusCode = 404;
      throw error;
    }
  }

  const updatedSchedule = await SCHEDULE_MODEL.findByIdAndUpdate(id, data, {
    new: true,
  }).populate('otId', 'otName');

  return updatedSchedule;
}

}

export default new ScheduleService();
