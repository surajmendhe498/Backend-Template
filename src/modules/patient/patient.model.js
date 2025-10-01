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
    paymentDetails:  {type: String },
    packageType: { type: String, enum: ["General Ward Package","Semi-Private Package","Private/Deluxe Package","Day-Care Package","Maternity - Normal Delivery","Maternity - C-Section","Cataract Package","Hernia Repair Package","Appendectomy Package","Knee Arthroscopy Package"] },
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
    tpaName: { type: String, enum: ["Medi Assist","FHPL (Family Health Plan)","Paramount","MDIndia","Vidal Health","Raksha TPA","Heritage Health","HealthIndia"] },
    policyNo: { type: String },
    ccnNo: { type: String },
    insuranceName: { type: String, enum: ["New India Assurance","United India Insurance","Oriental Insurance","National Insurance","HDFC ERGO","ICICI Lombard","Bajaj Allianz","Star Health & Allied","Care Health (Religare)","Niva Bupa","Aditya Birla Health","Tata AIG","SBI General"] },
    schemeName: { type: String, enum: ["Ayushman Bharat (PM-JAY)","Mukhyamantri Amrutam (Gujarat)","CGHS","ECHS","ESIC","PMJAY - MA Vatsalya"] },
    corporateName: { type: String, enum: ["Reliance Industries","Tata Steel","Adani Ports","Larsen & Toubro (L&T)","Infosys","TCS","Zydus Lifesciences","Torrent Power","IRCTC"] },
    cashType: { type: String, enum: ["Full Payment","Advance Only / Deposit","Part Payment","Refund / Adjustment"] },
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
    clinicalNotes: [{ pdf: { name: String, url: String, uploadedAt: { type: Date, default: Date.now } }, notes: [{ text: String, addedBy: String, addedAt: { type: Date, default: Date.now } }] }],
    nursingNotes: [{ pdf: { name: String, url: String, uploadedAt: { type: Date, default: Date.now } }, notes: [{ text: String, addedBy: String, addedAt: { type: Date, default: Date.now } }] }],
    surgicalNotes: [{ pdf: { name: String, url: String, uploadedAt: { type: Date, default: Date.now } }, notes: [{ text: String, addedBy: String, addedAt: { type: Date, default: Date.now } }] }],
    symptoms: [{ pdf: { name: String, url: String, uploadedAt: { type: Date, default: Date.now } }, notes: [{ text: String, addedBy: String, addedAt: { type: Date, default: Date.now } }] }],
    pastHistory: [{ pdf: { name: String, url: String, uploadedAt: { type: Date, default: Date.now } }, notes: [{ text: String, addedBy: String, addedAt: { type: Date, default: Date.now } }] }],
    vitalData: [{ pdf: { name: String, url: String, uploadedAt: { type: Date, default: Date.now } }, notes: [{ text: String, addedBy: String, addedAt: { type: Date, default: Date.now } }] }],
    otherData: [{ pdf: { name: String, url: String, uploadedAt: { type: Date, default: Date.now } }, notes: [{ text: String, addedBy: String, addedAt: { type: Date, default: Date.now } }] }],
    dischargeTemplates: [{template: { type: mongoose.Schema.Types.Mixed }, type: {type: String, enum: ['provisional', 'final']}}],
    otNotesTemplates: [{ template: { type: mongoose.Schema.Types.Mixed }}],
    // documentPdf: [{name: String, path: String, deleted: { type: Boolean, default: false }, }]},
  documentPdf: [
  {
    mainPdfId: { type: mongoose.Schema.Types.ObjectId, ref: "pdf-document4" },
    files: [
      { 
        fileId: { type: mongoose.Schema.Types.ObjectId },
        name: String,
        path: String,
        deleted: { type: Boolean, default: false },
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { 
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        name: String
    }
      }
    ]
  }
]}
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

