import mongoose from 'mongoose';

const OperativeTNotesOrderSchema = new mongoose.Schema({
  title: { type: String, required: true },       
  otherTitle: { type: String },                 
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, {
  timestamps: true, 
});

export const OPERATIVENOTESORDER_MODEL = mongoose.model('operativenotesorder', OperativeTNotesOrderSchema);


