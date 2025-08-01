import mongoose from 'mongoose';

const OTNotesTemplateSchema = new mongoose.Schema({
  nameOfSurgery: { type: String },
  diagnosis: { type: String },
  procedureGrade: { type: String },
  category: { type: String },
  primarySurgeon: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
  associateSurgeon: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
  assistantSurgeon: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
  anaesthetist: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor'  },
  nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'nurse'  },
  typeOfAnaesthesia: { type: String },
  operativeNotes: { type: String },
  operativeFindings: { type: String },
  implant: { type: String },
  incision: { type: String },
  partPreparation: { type: String },
  drain: { type: String },
  biopsy: {type: String},
  dressing: {type: String},
  suturing: {type: String},
  comments: {type: String},
  postoperativeInstruction: {type: String},
  bloodGroup: {type: String},
  bloodLoss: {type: String},
  bloodTransfusion: {type: String},
  histoPathologySampleSendTo: {type: String},
  opReport: {type: String},
  anaesthesia: {type: String},
  positioning: {type: String},
  surgicalProcedure: {type: String},
  saveAsTemplate: {type: String},
}
);

export const OTNOTESTEMPLATE_MODEL = mongoose.model('otnotestemplate', OTNotesTemplateSchema);
