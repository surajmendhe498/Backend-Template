import mongoose from 'mongoose';

const dischargeTemplateSchema= new mongoose.Schema({
    causeOfDeath: {type: String},
    crossConsultation: {type: String},
    diagnosis: {type: String},
    chiefComplaints: {type: String},
    pastHistory: {type: String},
    courseInHospital: {type: String},
    investigation: {type: String},
    treatmentGiven: {type: String},
    adviceAtDischarge: {type: String},
    adviceOnFollowUp: {type: String},
    MLCNO: {type: String},
    followUpDate: {type: String},
    RMO: {type: String},
    dischargeSummaryFinalizedBy: {type: String},
    saveAsTemplate: {type: String},
    acknowledgment: {type: Boolean, default: false},
})
   
export const DISCHARGETEMPLATE_MODEL= mongoose.model('DischargeTemplate', dischargeTemplateSchema);
