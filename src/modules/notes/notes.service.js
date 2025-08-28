import { PATIENT_MODEL } from '../patient/patient.model.js';

class NotesService {

   async addNotes({ patientId, admissionId, notes, user }) {
    const patient = await PATIENT_MODEL.findById(patientId);
    if (!patient) throw new Error("Patient not found");

    const admission = patient.admissionDetails.id(admissionId);
    if (!admission) throw new Error("Admission not found");

    const addedBy = user?.firstName || user?.username || "Unknown User";
    const addedAt = new Date();

    const fields = ['clinicalNotes','nursingNotes','surgicalNotes','symptoms','pastHistory','vitalData'];

    const addedNotesData = {}; 

    fields.forEach(field => {
      if (notes[field]) {
        const noteObj = { note: notes[field], addedBy, addedAt };
        admission[field] = admission[field] || [];
        admission[field].push(noteObj);
        addedNotesData[field] = [noteObj];
      }
    });

    await patient.save();

    return {
      message: "Notes added successfully",
      data: {
        patientId,
        admissionId,
        ...addedNotesData
      }
    };
  }

  async getNotes(patientId, admissionId) {
    const patient = await PATIENT_MODEL.findById(patientId)
      .select(
        'identityDetails.patientName admissionDetails._id admissionDetails.clinicalNotes admissionDetails.nursingNotes admissionDetails.surgicalNotes admissionDetails.symptoms admissionDetails.pastHistory admissionDetails.vitalData'
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
      vitalData: admission.vitalData
    };
  }

 
  async updateSpecificNote({ patientId, admissionId, field, noteId, newNote, user }) {
    const allowedFields = ['clinicalNotes','nursingNotes','surgicalNotes','symptoms','pastHistory','vitalData'];
    if (!allowedFields.includes(field)) throw new Error("Invalid note field");
    if (!noteId) throw new Error("noteId is required");

    const updatedBy = user?.firstName || user?.username || "Unknown User";

    const admission = await PATIENT_MODEL.findOne(
      { _id: patientId, "admissionDetails._id": admissionId },
      { "admissionDetails.$": 1 }
    );
    if (!admission) throw new Error("Admission not found");

    const noteArray = admission.admissionDetails[0][field];
    const noteIndex = noteArray.findIndex(n => n._id.toString() === noteId);
    if (noteIndex === -1) throw new Error(`No note with _id ${noteId} found in ${field}`);

    const updateObj = {};
    updateObj[`admissionDetails.$.${field}.${noteIndex}.note`] = newNote;
    updateObj[`admissionDetails.$.${field}.${noteIndex}.addedBy`] = updatedBy;
    updateObj[`admissionDetails.$.${field}.${noteIndex}.addedAt`] = new Date();

    await PATIENT_MODEL.updateOne(
      { _id: patientId, "admissionDetails._id": admissionId },
      { $set: updateObj }
    );

    return {
      message: `Note updated successfully in ${field}`,
      updatedNote: {
        _id: noteId,
        note: newNote,
        addedBy: updatedBy,
        addedAt: new Date()
      }
    };
  }

  async deleteNote({ patientId, admissionId, field, noteId }) {
  const allowedFields = ['clinicalNotes','nursingNotes','surgicalNotes','symptoms','pastHistory','vitalData'];
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


}

export default new NotesService();
