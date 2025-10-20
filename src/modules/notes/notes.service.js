import { PATIENT_MODEL } from '../patient/patient.model.js';
import imagekit from '../../helpers/imagekit.js';

class NotesService {

//  async addNotes({ patientId, admissionId, notes, user, files }) {
//     const patient = await PATIENT_MODEL.findById(patientId);
//     if (!patient) throw new Error("Patient not found");

//     const admission = patient.admissionDetails.id(admissionId);
//     if (!admission) throw new Error("Admission not found");

//     const addedBy = user?.firstName || user?.username || "Unknown User";
//     const addedAt = new Date();

//     const fields = ['clinicalNotes','nursingNotes','surgicalNotes','symptoms','pastHistory','vitalData', 'otherData'];
//     const addedNotesData = {}; 

//     for (const field of fields) {
//       if (notes[field]) {
//         const noteObj = { note: notes[field], addedBy, addedAt };

//         const pdfFieldName = `${field}Pdf`;
//         if (files && files[pdfFieldName]) {
//           noteObj.pdfs = [];

//           for (const file of files[pdfFieldName]) {
//             const uploadResult = await imagekit.upload({
//               file: file.buffer,
//               fileName: file.originalname,
//               folder: `/patient_notes/${patientId}/${admissionId}`
//             });

//             noteObj.pdfs.push({
//               name: file.originalname,
//               url: uploadResult.url,
//               uploadedAt: new Date()
//             });
//           }
//         }

//         admission[field] = admission[field] || [];
//         admission[field].push(noteObj);
//         addedNotesData[field] = [noteObj];
//       }
//     }

//     await patient.save();

//     return {
//       message: "Notes added successfully",
//       data: {
//         patientId,
//         admissionId,
//         ...addedNotesData
//       }
//     };
//   }
async addNotes({ patientId, admissionId, notes, user, files }) {
    const patient = await PATIENT_MODEL.findById(patientId);
    if (!patient) throw new Error("Patient not found");

    const admission = patient.admissionDetails.id(admissionId);
    if (!admission) throw new Error("Admission not found");

    const addedBy = user?.firstName || user?.username || "Unknown User";
    const addedAt = new Date();

    const fields = ['clinicalNotes','nursingNotes','surgicalNotes','symptoms','pastHistory','vitalData','otherData'];
    const addedNotesData = {};

    for (const field of fields) {
      if (notes[field]) {
        // Check if PDF uploaded
        const pdfFieldName = `${field}Pdf`;
        let pdfObj = null;

        if (files && files[pdfFieldName]) {
          const file = files[pdfFieldName][0];
          const uploadResult = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: `/patient_notes/${patientId}/${admissionId}`
          });

          pdfObj = { name: file.originalname, url: uploadResult.url, uploadedAt: new Date() };
        }

        // Notes entry
        const noteEntry = {
          pdf: pdfObj, // null if not provided
          notes: [{
            text: notes[field],
            addedBy,
            addedAt
          }]
        };

        admission[field] = admission[field] || [];
        admission[field].push(noteEntry);
        addedNotesData[field] = [noteEntry];
      }
    }

    await patient.save();

    return {
      message: "Notes added successfully",
      data: { patientId, admissionId, ...addedNotesData }
    };
  }

  async getNotes(patientId, admissionId) {
    const patient = await PATIENT_MODEL.findById(patientId)
      .select(
        'identityDetails.patientName admissionDetails._id admissionDetails.clinicalNotes admissionDetails.nursingNotes admissionDetails.surgicalNotes admissionDetails.symptoms admissionDetails.pastHistory admissionDetails.vitalData admissionDetails.otherData'
      );
    
    if (!patient) return [];

    const admission = patient.admissionDetails.find(a => a._id.toString() === admissionId);
    if (!admission) return [];

    return {
      patientName: patient.identityDetails?.patientName,
      admissionId: admission._id,
      clinicalNotes: admission.clinicalNotes,
      nursingNotes: admission.nursingNotes,
      surgicalNotes: admission.surgicalNotes,
      symptoms: admission.symptoms,
      pastHistory: admission.pastHistory,
      vitalData: admission.vitalData,
      otherData: admission.otherData
    };
  }

// async updateSpecificNote({ patientId, admissionId, noteGroupId, noteId, newText, pdfFile, user }) {
//   const allowedFields = ['clinicalNotes','nursingNotes','surgicalNotes','symptoms','pastHistory','vitalData','otherData'];

//   const patient = await PATIENT_MODEL.findById(patientId);
//   if (!patient) throw new Error("Patient not found");

//   const admission = patient.admissionDetails.id(admissionId);
//   if (!admission) throw new Error("Admission not found");

//   let updatedNote = null;

//   for (const field of allowedFields) {
//     const noteGroup = admission[field]?.id(noteGroupId);
//     if (!noteGroup) continue;

//     // Replace PDF only if pdfFile is provided
//     if (pdfFile) {
//       noteGroup.pdf = {
//         name: pdfFile.originalname,
//         url: (await imagekit.upload({
//           file: pdfFile.buffer,
//           fileName: pdfFile.originalname,
//           folder: `/patient_notes/${patientId}/${admissionId}`
//         })).url,
//         uploadedAt: new Date()
//       };
//     }

//     //Update existing text note if noteId is provided
//     if (noteId) {
//       const noteIndex = noteGroup.notes.findIndex(n => n._id.toString() === noteId);
//       if (noteIndex === -1) throw new Error("Note not found");
//       noteGroup.notes[noteIndex].text = newText;
//       noteGroup.notes[noteIndex].addedBy = user?.firstName || user?.username || "Unknown User";
//       noteGroup.notes[noteIndex].addedAt = new Date();
//       updatedNote = noteGroup.notes[noteIndex];
//     }

//     // Add new text note only if newText is provided AND noteId is not provided
//     if (newText && !noteId) {
//       const newNoteObj = {
//         text: newText,
//         addedBy: user?.firstName || user?.username || "Unknown User",
//         addedAt: new Date()
//       };
//       noteGroup.notes.push(newNoteObj);
//       updatedNote = newNoteObj;
//     }

//     break; 
//   }

//   await patient.save();

//   return {
//     message: "Note updated successfully",
//     updatedNote
//   };
// }
async updateSpecificNote({ patientId, admissionId, noteGroupId, noteId, newText, pdfFile, user }) {
  const allowedFields = [
    'clinicalNotes',
    'nursingNotes',
    'surgicalNotes',
    'symptoms',
    'pastHistory',
    'vitalData',
    'otherData'
  ];

  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const admission = patient.admissionDetails.id(admissionId);
  if (!admission) throw new Error("Admission not found");

  let updatedNote = null;
  let noteGroupFound = false;

  for (const field of allowedFields) {
    const noteGroup = admission[field]?.id(noteGroupId);
    if (!noteGroup) continue;

    noteGroupFound = true;

    // Replace PDF only if pdfFile is provided
    if (pdfFile) {
      const uploadResult = await imagekit.upload({
        file: pdfFile.buffer,
        fileName: pdfFile.originalname,
        folder: `/patient_notes/${patientId}/${admissionId}`
      });

      noteGroup.pdf = {
        name: pdfFile.originalname,
        url: uploadResult.url,
        uploadedAt: new Date()
      };
    }

    // Update existing text note if noteId is provided
    if (noteId) {
      const noteIndex = noteGroup.notes.findIndex(n => n._id.toString() === noteId);
      if (noteIndex === -1) {
        throw new Error("Note not found in this note group");
      }
      noteGroup.notes[noteIndex].text = newText;
      noteGroup.notes[noteIndex].addedBy = user?.firstName || user?.username || "Unknown User";
      noteGroup.notes[noteIndex].addedAt = new Date();
      updatedNote = noteGroup.notes[noteIndex];
    }

    // Add new text note only if newText is provided AND noteId is not provided
    if (newText && !noteId) {
      const newNoteObj = {
        text: newText,
        addedBy: user?.firstName || user?.username || "Unknown User",
        addedAt: new Date()
      };
      noteGroup.notes.push(newNoteObj);
      updatedNote = newNoteObj;
    }

    break; 
  }

  if (!noteGroupFound) throw new Error("Note group not found with this noteGroupId");
  if (!updatedNote && !pdfFile) throw new Error("Nothing to update: provide newText, noteId, or pdfFile");

  await patient.save();

  return {
    message: "Note updated successfully",
    updatedNote: updatedNote || { pdf: "PDF replaced successfully" }
  };
}

  async deleteNote({ patientId, admissionId, field, noteId }) {
  const allowedFields = ['clinicalNotes','nursingNotes','surgicalNotes','symptoms','pastHistory','vitalData', 'otherData'];
  if (!allowedFields.includes(field)) throw new Error("Invalid note field");

  const result = await PATIENT_MODEL.updateOne(
    { _id: patientId, "admissionDetails._id": admissionId, [`admissionDetails.${field}._id`]: noteId },
    { $pull: { [`admissionDetails.$.${field}`]: { _id: noteId } } }
  );

  if (!result.modifiedCount || result.modifiedCount === 0) {
    throw new Error(`No matching note found with noteId ${noteId} in admission ${admissionId}`);
  }

  return { message: `Note deleted successfully from ${field}`, noteId };
}

  async getSpecificNotes(patientId, admissionId, field) {
    const patient = await PATIENT_MODEL.findById(patientId)
      .select(`identityDetails.patientName admissionDetails._id admissionDetails.${field}`);
    
    if (!patient) throw new Error("Patient not found");

    const admission = patient.admissionDetails.find(a => a._id.toString() === admissionId);
    if (!admission) throw new Error("Admission not found");

    return {
      patientName: patient.identityDetails?.patientName,
      admissionId: admission._id,
      [field]: admission[field] || []
    };
  }


}

export default new NotesService();
