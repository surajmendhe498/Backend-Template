import Note_lable_masterService from "./note_lable_master.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Note_lable_masterController {
  constructor() {
    this.note_lable_masterService =  Note_lable_masterService;
  }

    getAll = async (req, res, next) => {
      try {
        const noteLables = await this.note_lable_masterService.getAll();
        res.status(statusCode.OK).json({ success: true, message: "Note Lable Masters fetched successfully", data: noteLables });
      } catch (err) {
        next(err);
      }
    };
  
    create = async (req, res, next) => {
      try {
        const noteLable = await this.note_lable_masterService.create(req.body);
        res.status(statusCode.CREATED).json({ success: true, message: "Note lable master created successfully", data: noteLable });
      } catch (err) {
        next(err);
      }
    };

  search = async (req, res, next) => {
  try {
    const noteLables = await this.note_lable_masterService.search(req.query);
    res.status(statusCode.OK).json({success: true,message: 'Search results fetched successfully', noteLables });
  } catch (err) {
    next(err);
  }
};
}
