import mongoose from 'mongoose';

const signatureMasterSchema= new mongoose.Schema({
    signatureTitle: {
        type: String,
        required: true
    },
    SignatureOtherTitle: {
        type: String
    },
    status: { type: Boolean, default: false}
}, {timestamps: true}
);

export const SIGNATUREMASTER_MODEL= mongoose.model('signaturemaster', signatureMasterSchema);