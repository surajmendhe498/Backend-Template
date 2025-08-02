import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

export const DEPARTMENT_MODEL= mongoose.model('department', DepartmentSchema);
