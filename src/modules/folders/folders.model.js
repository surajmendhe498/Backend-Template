// import mongoose from 'mongoose';

// const folderSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true},
//     type: {
//       type: String,
//       enum: ['videoRecordings', 'audioRecordings', 'docs', 'labReports', 'radiologyReports'],
//       required: true,
//     },
//     patientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'patients',
//       required: true,
//     },
//     admissionId: {
//       type: mongoose.Schema.Types.ObjectId, 
//       required: true,
//     },
//     files: [
//       {
//         fileId: {
//           type: mongoose.Schema.Types.ObjectId,
//           required: true,
//         },
//         name: String,
//         path: String,
//         label: String,
//         duration: Number,
//         uploadedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// export const FOLDER_MODEL = mongoose.model('Folder', folderSchema);


import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: String,
    path: String,
    label: String,
    duration: Number,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } 
);

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'videoRecordings',
        'audioRecordings',
        'docs',
        'labReports',
        'radiologyReports',
      ],
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'patients',
      required: true,
    },
    admissionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    files: [fileSchema],
  },
  {
    timestamps: true,
  }
);

export const FOLDER_MODEL = mongoose.model('Folder', folderSchema);
