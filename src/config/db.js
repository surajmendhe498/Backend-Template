import mongoose from 'mongoose';

import {config} from 'dotenv';
config();

const connectDB= async()=>{
    mongoose.connect(process.env.DB_URL)
        .then(()=>{
            console.log('MongoDB Connected');
        })
        .catch((err)=>{
            console.log(err);
        })
}

export default connectDB;