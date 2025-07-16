import Operative_notes_orderService from "./operative_notes_order.service.js";
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class Operative_notes_orderController {
  constructor() {
    this.operative_notes_orderService = Operative_notes_orderService;
  }

  getAll = async (req, res, next) => {
    try {
      const operativeNotes = await this.operative_notes_orderService.getAll();
      res.status(statusCode.OK).json({
        success: true,
        message: "Operative notes fetched successfully",
        data: operativeNotes
      });
    } catch (err) {
      next(err);
    }
  };

  updateField = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { otherTitle, status } = req.body;

      // if (!otherTitle || !status) {
      //   return res.status(statusCode.BAD_REQUEST).json({
      //     success: false,
      //     message: "Both otherTitle and status are required"
      //   });
      // }

      const updated = await this.operative_notes_orderService.update(id, { otherTitle, status });

      if (!updated) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Operative note not found"
        });
      }

      res.status(statusCode.OK).json({
        success: true,
        message: "Operative note updated successfully",
        data: updated
      });
    } catch (err) {
      next(err);
    }
  };
}
