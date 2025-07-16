import mongoose from 'mongoose';

const DischargeFieldMasterSchema= new mongoose.Schema({
    SummaryTitle: {
        type: String,
        required: true
    },
    summarySection: {
        type: String,
    },
    status: { type: Boolean, default: false}
},
);

export const DISCHARGEFIELDMASTER_MODEL= mongoose.model('dischargefiledmaster', DischargeFieldMasterSchema);