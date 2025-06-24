import mongoose from 'mongoose';

const OTNotesTemplateSchema = new mongoose.Schema({
  templateName:{
    type: String,
    required: true
  } 
}, {timestamps:true}
);

export const OTNOTESTEMPLATE_MODEL = mongoose.model('otnotestemplate', OTNotesTemplateSchema);
