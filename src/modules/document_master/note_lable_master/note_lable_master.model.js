import mongoose from 'mongoose';

const NoteLableMasterSchema = new mongoose.Schema({
  title: { type: String, required: true },       
  otherTitle: { type: String },                 
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, {
  timestamps: true, 
});

export const NOTELABLEMASTER_MODEL = mongoose.model('notelablemaster', NoteLableMasterSchema);


