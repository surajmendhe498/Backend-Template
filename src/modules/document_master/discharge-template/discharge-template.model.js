import mongoose from 'mongoose';

const dischargeTemplateSchema= new mongoose.Schema(
    {},
    { strict: false },
)
   
export const DISCHARGETEMPLATE_MODEL= mongoose.model('DischargeTemplate', dischargeTemplateSchema);
