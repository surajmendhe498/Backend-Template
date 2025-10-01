import TicketService from "./ticket.service.js";
 import { statusCode } from '../../utils/constants/statusCode.js';

export default class TicketController {
  constructor() {
    this.ticketService =  TicketService;
  }

   getAll = async (req, res, next) => {
    try {
      const tickets = await this.ticketService.getAll();
      res.success("Tickets fetched successfully", tickets, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const user = req.user; 
      const { issueTitle, description } = req.body;

      const ticket = await this.ticketService.create({ issueTitle, description, user });
      res.success("Ticket created successfully", ticket, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const ticket = await this.ticketService.getById(req.params.id);
      if (!ticket) return res.status(statusCode.NOT_FOUND).json({ message: 'Ticket not found' });

      res.success("Ticket fetched successfully", ticket, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ticket = await this.ticketService.updateStatus(req.params.id, status);
    res.success("Ticket status updated successfully", ticket, statusCode.OK);
  } catch (err) {
    next(err);
  }
};
  fetchUserTickets = async (req, res, next) => {
  try {
    console.log("Logged in user:", req.user._id);
    const tickets = await this.ticketService.getUserTickets(req.user._id);
    res.json({ success: true, tickets });
  } catch (err) {
    next(err);
  }
};

}
