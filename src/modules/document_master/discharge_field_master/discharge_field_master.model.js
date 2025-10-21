import mongoose from 'mongoose';
// import { required } from 'zod/v4-mini';

// const DischargeFieldMasterSchema= new mongoose.Schema({
//     SummaryTitle: {
//         type: String,
//         required: true
//     },
//     summarySection: {
//         type: String,
//     },
//     status: { type: Boolean, default: false}
// },
// );

const DischargeFieldMasterSchema= new mongoose.Schema({
    name: {type: String, required: true},
    label: {type: String, required: true},
    type: {type: String, required: true},
    summarySection: { type: String },
    status: { type: Boolean, default: false}
},
);

export const DISCHARGEFIELDMASTER_MODEL= mongoose.model('discharge-field-master', DischargeFieldMasterSchema);