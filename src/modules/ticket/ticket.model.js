import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  issueTitle: { type: String, required: true },
  description: { type: String, required: true },
  raisedBy: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    firstName: String,
    lastName: String,
    email: String,
    role: String
  },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
});

export const TICKET_MODEL = mongoose.model('ticket', ticketSchema);
