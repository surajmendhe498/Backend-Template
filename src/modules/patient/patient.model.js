import mongoose from 'mongoose';

const AdmissionSchema = new mongoose.Schema(
  {
    existingPatient: { type: Boolean, default: false },
    reasonForAdmission: {type: mongoose.Schema.Types.ObjectId,ref: 'admission-reason'},
    uhidNo: { type: String, required: true, unique: true },
    IPD: { type: String, required: true },
    emergencyNo: { type: String },
    salutation: { type: String },
    patientName: { type: String, required: true },
    patientPhoto: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    contactNo: { type: String },
    whatsappNo: { type: String },
    email: { type: String },
    floorDetails: {type: mongoose.Schema.Types.ObjectId, ref: 'floormaster'},
    bedName: {type: mongoose.Schema.Types.ObjectId, ref: 'bedmaster'},
    applicableClass: {type: String},
    bedDepartment: { type: String },
    admissionDate: { type: Date },
    timeOfAdmission: { type: String },
    dischargeDate: { type: Date },
    timeOfDischarge: { type: String },
    consultingDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
    referredByDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'referred-doctor' }, 
    otherConsultant: { type: String },
    patientStatus: { type: String, enum: ['Admitted', 'Discharged'], default: 'Admitted' },
    mlc: { type: Boolean, default: false },
    mlcNo: { type: String },
    dateOfBirth: { type: Date },
    age: {
      years: { type: Number },
      months: { type: Number },
    },
    patientReligion: { type: String },
    paymentMode: { 
      type: String, 
      enum: ['Cash', 'Card', 'Insurance', 'Scheme', 'Corporate', 'Package'] 
    },
    paymentDetails: { type: String },
    cashType: { type: String },
    freeText: { type: String },
    remarks: { type: String },
    provisionalDiagnosis: { type: String },
    finalDiagnosis: { type: String },
    finalDiagnosisICDCode: { type: String },
    dischargeSummaryStatus: { type: String },
    tpaName: { type: String },
    policyNo: { type: String },
    ccnNo: { type: String },
    insurance: { type: String },
    scheme: { type: String },
    corporate: { type: String },
    companyName: { type: String },
    claimStatus: { type: String },
    patientDetail: {
      type: String,
      enum: ['Birth', 'Expired'],
    },
  },
  { _id: false } 
);

const IdentityDetailsSchema = new mongoose.Schema(
  {
    address: { type: String },
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
    aadharCardFrontImage: { type: String },
    aadharCardBackImage: { type: String },
    panCardId: { type: String },
    panCardImage: { type: String },
    healthCardId: { type: String },
    healthCardImage: { type: String },
  },
  { _id: false }
);

const PatientRegistrationSchema = new mongoose.Schema(
  {
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

