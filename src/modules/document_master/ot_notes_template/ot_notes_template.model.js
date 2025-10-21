import mongoose from 'mongoose';

const OTNotesTemplateSchema = new mongoose.Schema(
   {},
   { strict: false },
);

export const OTNOTESTEMPLATE_MODEL = mongoose.model('otnotestemplate', OTNotesTemplateSchema);
