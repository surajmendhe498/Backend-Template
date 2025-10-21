import mongoose from 'mongoose';

const OperativeTNotesOrderSchema = new mongoose.Schema({     
  name: { type: String },                 
  label: { type: String },                 
  type: { type: String },                 
  otherTitle: { type: String },                 
  status: { type: Boolean, default: false},
},  
);

export const OPERATIVENOTESORDER_MODEL = mongoose.model('operativenotes-order', OperativeTNotesOrderSchema);


