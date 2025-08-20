import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['User', 'Admin'], default: 'User'},

}, {timestamps:true})

export const USER_MODEL= mongoose.model('user', userSchema);