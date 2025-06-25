import mongoose from 'mongoose';

const DischargeFieldMasterSchema= new mongoose.Schema({
    dischargeSummaryTitle: {
        type: String,
        required: true
    },
    summarySection: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
},{timestamps:true},
);

export const DISCHARGEFIELDMASTER_MODEL= mongoose.model('dischargefiledmaster', DischargeFieldMasterSchema);