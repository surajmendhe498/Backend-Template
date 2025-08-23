import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: { type: String, enum: ['Admin', 'Nursing', 'Management', 'Medical officer', 'Consultant', 'Billing', 'MRD'], default: 'Admin' },
    photo: { type: String},

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

}, {timestamps:true})

export const USER_MODEL= mongoose.model('user', userSchema);