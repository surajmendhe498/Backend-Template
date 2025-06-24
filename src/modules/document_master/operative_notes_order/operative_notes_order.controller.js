import Operative_notes_orderService from "./operative_notes_order.service.js";
 import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Operative_notes_orderController {
  constructor() {
    this.operative_notes_orderService =  Operative_notes_orderService;
  }

    getAll = async (req, res, next) => {
      try {
        const operativeNotes = await this.operative_notes_orderService.getAll();
        res.status(statusCode.OK).json({ success: true, message: "Operative notes fetched successfully", data: operativeNotes });
      } catch (err) {
        next(err);
      }
    };
  
    create = async (req, res, next) => {
      try {
        const operativeNotes = await this.operative_notes_orderService.create(req.body);
        res.status(statusCode.CREATED).json({ success: true, message: "Operative Notes created successfully", data: operativeNotes });
      } catch (err) {
        next(err);
      }
    };

  search = async (req, res, next) => {
  try {
    const operativeNotes = await this.operative_notes_orderService.search(req.query);
    res.status(statusCode.OK).json({success: true,message: 'Search results fetched successfully', operativeNotes });
  } catch (err) {
    next(err);
  }
};
  
}
