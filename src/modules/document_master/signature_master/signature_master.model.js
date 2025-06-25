import mongoose from 'mongoose';

const signatureMasterSchema= new mongoose.Schema({
    signatureTitle: {
        type: String,
        required: true
    },
    otherTitle: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {timestamps: true}
);

export const SIGNATUREMASTER_MODEL= mongoose.model('signaturemaster', signatureMasterSchema);