import { TICKET_MODEL } from "./ticket.model.js";
import nodemailer from 'nodemailer'

class TicketService {

  async getAll() {
    return await TICKET_MODEL.find();
  }

  async create({ issueTitle, description, user }) {
    const ticket = await TICKET_MODEL.create({
      issueTitle,
      description,
      raisedBy: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

    // send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER, // your support email
      subject: `New Ticket Raised: ${issueTitle}`,
      html: `
        <p>A new ticket has been raised by ${user.firstName} ${user.lastName} (${user.email})</p>
        <p><strong>Issue:</strong> ${issueTitle}</p>
        <p><strong>Description:</strong> ${description}</p>
      `
    });

    return ticket;
  }

  async getById(id) {
    return await TICKET_MODEL.findById(id);
  }

  async updateStatus(id, status) {
  const ticket = await TICKET_MODEL.findById(id);
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  ticket.status = status;
  await ticket.save();
  return ticket;
}

async getUserTickets (userId){
  return await TICKET_MODEL.find({ "raisedBy.id": userId });
};

}

export default new TicketService();
