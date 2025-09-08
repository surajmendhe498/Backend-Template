// import mongoose from 'mongoose';

// const AdmissionSchema = new mongoose.Schema(
//   {
//     weight: { type: Number },
//     registrationType: {
//       type: String,
//       enum: ['IPD', 'OPD', 'Registration', 'Day Care', 'Dialysis'],
//     },
//     mlcType: { type: Boolean},
//     patientPhoto: { type: String },
//     birthAsphyxiaAndNICUShifted: { type: Boolean, default: false },
//     bloodGroup: { type: String },
//     termOfBaby: { type: String },
//     modeOfDelivery: { type: String },
//     babyIllness: { type: String },
//     floorId: {type: mongoose.Schema.Types.ObjectId, ref: 'floormaster'},
//     bedId: {type: mongoose.Schema.Types.ObjectId, ref: 'bedmaster'},
//     consultingDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
//     referredByDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'referred-doctor' },
//     laboratorySelectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'labmaster' },
//     admissionReasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'admission-reason' },
//     referredByDoctorSelectBox: { type: String },
//     provisionalDiagnosis: { type: String },
//     finalDiagnosis: { type: String },
//     operations: { type: String },
//     corporation: { type: String, enum: ['In-Corporation', 'Out-Corporation'] },
//     relativeDetails: {
//       responsiblePerson: { type: String },
//       relationship: { type: String, enum: ['Parent', 'Spouse', 'Sibling', 'Other'] },
//       relativeContactNo: { type: String }
//     },
//     covidReport: { type: String },
//     vaccinationDetails: { type: String },
//     signatureDetails: {
//       dischargeInterpreterNurseSign: { type: String },
//       dischargePatientGuardianSign: { type: String },
//       dischargeRelativeWitnessSign: { type: String },
//       interpreterNurseSign: { type: String },
//       patientGuardianSign: { type: String },
//       receptionSign: { type: String },
//       relativeWitnessSign: { type: String },
//     },
//     height: { type: Number },
//     otherConsultant: { type: String },
//     patientAllergicOrUnderPrecaution: { type: String },
//     clinicalDischarge: { type: Boolean, default: false },
//     billingDischarge: { type: Boolean, default: false },
//     applicableClass: { type: String },
//     paymentRemark: { type: String },
//     mlcNo: { type: String },
//     employerCompanyName: { type: String },
//     TIDNumber: { type: String },
//     pharmacyDischarge: { type: Boolean, default: false },
//     paymentMode: {
//       type: String,
//       enum: ['Cash', 'TPA', 'Insurance', 'Scheme', 'Corporate', 'Package', 'Reimbursement']
//     },
//     maintainMRDFileStatus: { type: Boolean, default: false },
//     patientGuardianDetails: { type: String },
//     consultantUnit: { type: String },
//     bedDepartment: { type: String },
//     patientType: { type: String, enum: ['New', 'Old'] },
//     husbandName: { type: String },
//     foodPreference: { type: String },
//     birthTime: { type: String },
//     motherAge: { type: Number },
//     complaints: { type: String },
//     pastFamilyHistory: { type: String },
//     remark: { type: String },
//     addDietModule: { type: Boolean, default: false },
//     useClinicalScoreCalculator: { type: Boolean, default: false },
//     labDischarge: { type: Boolean, default: false },
//     CPT: { type: String },
//     referralFromDoctor: { type: String },
//     emergencyNo: { type: String },
//     declareAsCriticalPatient: { type: Boolean, default: false },
//     patientDetail: { type: String, enum: ['Birth', 'Expired'] },
//     tpaName: { type: String },
//     policyNo: { type: String },
//     ccnNo: { type: String },
//     insurance: { type: String },
//     scheme: { type: String },
//     cashType: { type: String },
//     freeText: { type: String },
//     claimStatus: { type: String, enum: ['Unknown', 'Initial Approved', 'Query 1', 'Query 2', 'Under Process', 'Query Raised', 'Final Approved', 'Query 1 Resolved', 'Query 2 Resolved'], default: 'Unknown' },
//     finalDiagnosisICDCode: { type: String },
//     admissionDate: { type: Date},
//     admissionTime: { type: String},
//     ipdNo: {type: String},
//     patientStatus: { type: String, enum: ['Admitted', 'Discharged'], default: 'Admitted' },
//     docs: [{  name: String, path: String, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
//     labReports: [{ name: String, path: String, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
//     radiologyReports: [{ name: String, path: String, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
//     audioRecordings: [{  name: String, path: String, label: String, duration: Number, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
//     videoRecordings: [{  name: String, path: String, label: String, duration: Number, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
//     clinicalNotes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
//     nursingNotes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
//     surgicalNotes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
//     symptoms: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
//     pastHistory: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
//     vitalData: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
//     dischargeTemplates: [{template: { type: mongoose.Schema.Types.Mixed }}],
//     otNotesTemplates: [{ template: { type: mongoose.Schema.Types.Mixed }}],
//   },
// );

// const IdentityDetailsSchema = new mongoose.Schema(
//   {
//     patientName: { type: String },
//     uhidNo: { type: String },
//     salutation: { type: String },
//     gender: { type: String, enum: ['Male', 'Female', 'Other'] },
//     age: {
//       years: { type: Number },
//       months: { type: Number },
//     },
//     dateOfBirth: { type: Date },
//     contactNo: { type: String },
//     whatsappNo: { type: String },
//     email: { type: String },
//     patientReligion: { type: String },
//     address: { type: String },
//     city: { type: String },
//     pinCode: { type: String },
//     aadharDetails: {                                           
//       aadharNo: { type: String },
//       aadharCardFrontImage: { type: String },
//       aadharCardBackImage: { type: String }
//     },
//     panCardDetails: {                                          
//       panCardId: { type: String },
//       panCardImage: { type: String }
//     },
//     healthCardDetails: {
//       healthCardId: { type: String },
//       healthCardImage: { type: String }
//     }
//   },
//   { _id: false }
// );

// const PatientRegistrationSchema = new mongoose.Schema(
//   {
//     identityDetails: { type: IdentityDetailsSchema },
//     admissionDetails: [AdmissionSchema],
//   },
//   { timestamps: true }
// );

// export const PATIENT_MODEL = mongoose.model('patients', PatientRegistrationSchema);


import mongoose from 'mongoose';

const AdmissionSchema = new mongoose.Schema(
  {
    weight: { type: Number },
    registrationType: {
      type: String,
      enum: ['IPD', 'OPD', 'Registration', 'Day Care', 'Dialysis'],
    },
    mlcType: { type: Boolean},
    patientPhoto: { type: String },
    birthAsphyxiaAndNICUShifted: { type: Boolean, default: false },
    bloodGroup: { type: String },
    termOfBaby: { type: String },
    modeOfDelivery: { type: String },
    babyIllness: { type: String },
    floorId: {type: mongoose.Schema.Types.ObjectId, ref: 'floormaster'},
    bedId: {type: mongoose.Schema.Types.ObjectId, ref: 'bedmaster'},
    consultingDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
    referredByDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'referred-doctor' },
    laboratorySelectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'labmaster' },
    admissionReasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'admission-reason' },
    referredByDoctorSelectBox: { type: String },
    provisionalDiagnosis: { type: String },
    finalDiagnosis: { type: String },
    operations: { type: String },
    corporation: { type: String, enum: ['In-Corporation', 'Out-Corporation'] },
    relativeDetails: {
      responsiblePerson: { type: String },
      relationship: { type: String, enum: ['Parent', 'Spouse', 'Sibling', 'Other'] },
      relativeContactNo: { type: String }
    },
    covidReport: { type: String },
    vaccinationDetails: { type: String },
    signatureDetails: {
      dischargeInterpreterNurseSign: { type: String },
      dischargePatientGuardianSign: { type: String },
      dischargeRelativeWitnessSign: { type: String },
      interpreterNurseSign: { type: String },
      patientGuardianSign: { type: String },
      receptionSign: { type: String },
      relativeWitnessSign: { type: String },
    },
    height: { type: Number },
    otherConsultant: { type: String },
    patientAllergicOrUnderPrecaution: { type: String },
    clinicalDischarge: { type: Boolean, default: false },
    billingDischarge: { type: Boolean, default: false },
    billingDischargeDate: { type: Date },
    billingDischargeTime: { type: String },
    finalDischargeDate: { type: Date },
    finalDischargeTime: { type: String },
    reasonForDischarge: { type: String },
    applicableClass: { type: String },
    paymentRemark: { type: String },
    mlcNo: { type: String },
    employerCompanyName: { type: String },
    TIDNumber: { type: String },
    pharmacyDischarge: { type: Boolean, default: false },
    paymentMode: {
      type: String,
      enum: ['Cash', 'TPA', 'Insurance', 'Scheme', 'Corporate', 'Package', 'Reimbursement']
    },
    maintainMRDFileStatus: { type: Boolean, default: false },
    patientGuardianDetails: { type: String },
    consultantUnit: { type: String },
    bedDepartment: { type: String },
    patientType: { type: String, enum: ['New', 'Old'] },
    husbandName: { type: String },
    foodPreference: { type: String },
    birthTime: { type: String },
    motherAge: { type: Number },
    complaints: { type: String },
    pastFamilyHistory: { type: String },
    remark: { type: String },
    addDietModule: { type: Boolean, default: false },
    useClinicalScoreCalculator: { type: Boolean, default: false },
    labDischarge: { type: Boolean, default: false },
    CPT: { type: String },
    referralFromDoctor: { type: String },
    emergencyNo: { type: String },
    declareAsCriticalPatient: { type: Boolean, default: false },
    patientDetail: { type: String, enum: ['Birth', 'Expired'] },
    tpaName: { type: String },
    policyNo: { type: String },
    ccnNo: { type: String },
    insurance: { type: String },
    scheme: { type: String },
    cashType: { type: String },
    freeText: { type: String },
    claimStatus: { type: String, enum: ['Unknown', 'Initial Approved', 'Query 1', 'Query 2', 'Under Process', 'Query Raised', 'Final Approved', 'Query 1 Resolved', 'Query 2 Resolved'], default: 'Unknown' },
    finalDiagnosisICDCode: { type: String },
    admissionDate: { type: Date},
    admissionTime: { type: String},
    ipdNo: {type: String},
    patientStatus: { type: String, enum: ['Admitted', 'Discharged'], default: 'Admitted' },
    docs: [{  name: String, path: String, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
    labReports: [{ name: String, path: String, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
    radiologyReports: [{ name: String, path: String, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
    audioRecordings: [{  name: String, path: String, label: String, duration: Number, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
    videoRecordings: [{  name: String, path: String, label: String, duration: Number, uploadedBy: { type: String }, uploadedAt: { type: Date, default: Date.now } }],
    clinicalNotes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
    nursingNotes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
    surgicalNotes: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
    symptoms: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
    pastHistory: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
    vitalData: [{ note: String, addedBy: String, addedAt: { type: Date, default: Date.now }}],
    dischargeTemplates: [{template: { type: mongoose.Schema.Types.Mixed }}],
    otNotesTemplates: [{ template: { type: mongoose.Schema.Types.Mixed }}],
  },
);

const IdentityDetailsSchema = new mongoose.Schema(
  {
    patientName: { type: String },
    uhidNo: { type: String },
    salutation: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    age: {
      years: { type: Number },
      months: { type: Number },
    },
    dateOfBirth: { type: Date },
    contactNo: { type: String },
    whatsappNo: { type: String },
    email: { type: String },
    patientReligion: { type: String },
    address: { type: String },
    city: { type: String },
    pinCode: { type: String },
    aadharDetails: {                                           
      aadharNo: { type: String },
      aadharCardFrontImage: { type: String },
      aadharCardBackImage: { type: String }
    },
    panCardDetails: {                                          
      panCardId: { type: String },
      panCardImage: { type: String }
    },
    healthCardDetails: {
      healthCardId: { type: String },
      healthCardImage: { type: String }
    }
  },
  { _id: false }
);

const PatientRegistrationSchema = new mongoose.Schema(
  {
    identityDetails: { type: IdentityDetailsSchema },
    admissionDetails: [AdmissionSchema],
  },
  { timestamps: true }
);

export const PATIENT_MODEL = mongoose.model('patients', PatientRegistrationSchema);

