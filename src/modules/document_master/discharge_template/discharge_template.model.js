import mongoose from 'mongoose';

const dischargeTemplateSchema= new mongoose.Schema({
    templateName: {
        type: String,
        required: true
    }
}, {timestamps:true}
);

export const DISCHARGETEMPLATE_MODEL= mongoose.model('DischargeTemplate', dischargeTemplateSchema);
