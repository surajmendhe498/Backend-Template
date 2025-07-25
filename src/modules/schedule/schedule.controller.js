import ScheduleService from "./schedule.service.js";
import { statusCode } from '../../utils/constants/statusCode.js';

export default class ScheduleController {
  constructor() {
    this.scheduleService =  ScheduleService;
  }

  getAll = async (req, res, next) => {
    try {
      const schedules = await this.scheduleService.getAll();
      res.success("All schedules fetched", schedules, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const newSchedule = await this.scheduleService.create(req.body);
      res.success("Schedule created successfully", newSchedule, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };
  

  deleteById = async (req, res, next) => {
  try {
    const deletedSchedule = await this.scheduleService.deleteById(req.params.id);

    if (!deletedSchedule) {
      return res.status(statusCode.NOT_FOUND).json({message: 'Schedule not found'});
    }

    res.success("Schedule deleted successfully", null, statusCode.OK);
  } catch (err) {
    next(err);
  }
};

update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedSchedule = await this.scheduleService.update(id, req.body);

    if (!updatedSchedule) {
      return res.status(statusCode.NOT_FOUND).json({ message: 'Schedule not found' });
    }

    res.success("Schedule updated successfully", updatedSchedule, statusCode.OK);
  } catch (err) {
    if (err.statusCode === 404 && err.message.includes("OT not found")) {
      return res.status(statusCode.BAD_REQUEST).json({ message: err.message });
    }
    next(err);
  }
};

}
