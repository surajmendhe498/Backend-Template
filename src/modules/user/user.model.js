import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    password: {type: String},
    role: {type: String, enum: ['User', 'Admin'], default: 'User'},

}, {timestamps:true})

export const USER_MODEL= mongoose.model('user', userSchema);