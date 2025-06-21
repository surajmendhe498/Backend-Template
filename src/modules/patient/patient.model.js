import mongoose from 'mongoose';

const AdmissionSchema = new mongoose.Schema(
  {
    existingPatient: { type: Boolean, default: false },
    reasonForAdmission: { type: String },
    IPD: { type: String, required: true },
    emergencyNo: { type: String },
    salutation: { type: String },
    patientName: { type: String, required: true },
    dateOfBirth: { type: Date },
    age: {
      years: { type: Number },
      months: { type: Number },
    },
  },
  { _id: false } 
);

const IdentityDetailsSchema = new mongoose.Schema(
  {
    address: { type: String},
    city: { type: String },
    pinCode: { type: String },
    corporation: { 
      type: String, 
      enum: ['In-Corporation', 'Out-Corporation'], 
      required: true 
    },
    responsiblePerson: { type: String },
    relationship: { 
      type: String, 
      enum: ['Parent', 'Spouse', 'Sibling', 'Other'] 
    },
    relativeContactNo: { type: String },
    aadharNo: { type: String, unique: true },
  },
  { _id: false } 
);

const PatientRegistrationSchema = new mongoose.Schema(
  {
    UHID: { type: String, unique: true, required: true },
    registrationType: {
      type: String,
      enum: ['IPD', 'OPD', 'Registration', 'Day Care', 'Dialysis'],
      required: true,
    },
    admissionDetails: { type: AdmissionSchema, required: true },
    identityDetails: { type: IdentityDetailsSchema, required: true },
  },
  { timestamps: true } 
);


export const PATIENT_MODEL = mongoose.model('patients', PatientRegistrationSchema);
