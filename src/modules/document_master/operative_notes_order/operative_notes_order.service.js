import { OPERATIVENOTESORDER_MODEL } from './operative_notes_order.model.js';

class Operative_notes_orderService {
  async seedIfEmpty() {
    const count = await OPERATIVENOTESORDER_MODEL.countDocuments();
    if (count === 0) {
      const defaultNotes = [
      { name: "nameOfSurgery", label: "Name of Surgery", type: "text", otherTitle: "", status: false },
      { name: "diagnosis", label: "Diagnosis", type: "text", otherTitle: "", status: false },
      { name: "procedureGrade", label: "Procedure Grade", type: "text", otherTitle: "", status: false },
      { name: "category", label: "Category", type: "text", otherTitle: "", status: false },
      { name: "surgeryDateTime", label: "Surgery Date & Time", type: "text", otherTitle: "", status: false },
      { name: "primarySurgeon", label: "Primary Surgeon", type: "select", otherTitle: "", status: false },
      { name: "associateSurgeon", label: "Associate Surgeon", type: "select", otherTitle: "", status: false },
      { name: "assistantSurgeon", label: "Assistant Surgeon", type: "select", otherTitle: "", status: false },
      { name: "anaesthetist", label: "Anaesthetist", type: "select", otherTitle: "", status: false },
      { name: "nurse", label: "Nurse", type: "select2", otherTitle: "", status: false },
      { name: "typeOfAnaesthesia", label: "Type of Anaesthesia", type: "richText", otherTitle: "", status: false },
      { name: "operativeNotes", label: "Operative Notes", type: "richText", otherTitle: "", status: false },
      { name: "operativeFindings", label: "Operative Findings", type: "richText", otherTitle: "", status: false },
      { name: "implant", label: "Implant", type: "richText", otherTitle: "", status: false },
      { name: "incision", label: "Incision", type: "richText", otherTitle: "", status: false },
      { name: "partPreparation", label: "Part Preparation", type: "richText", otherTitle: "", status: false },
      { name: "drain", label: "Drain", type: "richText", otherTitle: "", status: false },
      { name: "biopsy", label: "Biopsy", type: "richText", otherTitle: "", status: false },
      { name: "dressing", label: "Dressing", type: "richText", otherTitle: "", status: false },
      { name: "suturing", label: "Suturing", type: "richText", otherTitle: "", status: false },
      { name: "comments", label: "Comments", type: "richText", otherTitle: "", status: false },
      { name: "postoperativeInstruction", label: "Postoperative Instruction", type: "richText", otherTitle: "", status: false },
      { name: "bloodGroup", label: "Blood Group", type: "text", otherTitle: "", status: false },
      { name: "bloodLoss", label: "Blood Loss", type: "text", otherTitle: "", status: false },
      { name: "bloodTransfusion", label: "Blood Transfusion", type: "text", otherTitle: "", status: false },
      { name: "histoPathologySampleSentTo", label: "Histo Pathology Sample Sent to", type: "text", otherTitle: "", status: false },
      { name: "preoperativeDiagnosis", label: "Preoperative Diagnosis", type: "text", otherTitle: "", status: false },
      { name: "postoperativeDiagnosis", label: "Postoperative Diagnosis", type: "text", otherTitle: "", status: false },
      { name: "surgeryPerformed", label: "Surgery Performed", type: "text", otherTitle: "", status: false },
      { name: "specimenForHistologyPathology", label: "Specimen For Histology/Pathology", type: "text", otherTitle: "", status: false },
      { name: "indication", label: "Indication", type: "text", otherTitle: "", status: false },
      { name: "indicationOfSurgery", label: "Indication of Surgery", type: "text", otherTitle: "", status: false },
      { name: "spongeCount", label: "Sponge Count", type: "text", otherTitle: "", status: false },
      { name: "instrumentCount", label: "Instrument Court", type: "text", otherTitle: "", status: false },
      { name: "operativeConsent", label: "Operative Consent", type: "text", otherTitle: "", status: false },
      { name: "operativeNotesOther", label: "Operative Notes Other", type: "text", otherTitle: "", status: false },
      { name: "treatmentGiven", label: "Treatment Given", type: "text", otherTitle: "", status: false },
      { name: "displayInsideDischargeSummary", label: "Display Inside Discharge Summary", type: "text", otherTitle: "", status: false },
      { name: "typeOfSurgery", label: "Type of Surgery", type: "text", otherTitle: "", status: false },
      { name: "assistantNurse", label: "Assistant Nurse", type: "text", otherTitle: "", status: false },
      { name: "additionalSurgery", label: "Additional Surgery", type: "text", otherTitle: "", status: false },
      { name: "additionalSurgeryPerformed", label: "Additional Surgery Performed", type: "text", otherTitle: "", status: false },
      { name: "opReport", label: "OP Report", type: "text", otherTitle: "", status: false },
      { name: "anesthesia", label: "Anesthesia", type: "text", otherTitle: "", status: false },
      { name: "positioning", label: "Positioning", type: "text", otherTitle: "", status: false },
      { name: "surgicalProcedure", label: "Surgical Procedure", type: "text", otherTitle: "", status: false },
      { name: "steps", label: "Steps", type: "text", otherTitle: "", status: false },
      { name: "postOpOrders", label: "Post OP Orders", type: "text", otherTitle: "", status: false },
      { name: "babyNotes", label: "Baby Notes", type: "text", otherTitle: "", status: false },
      { name: "saveAsTemplate", label: "Save As Template", type: "text", otherTitle: "", status: true }
    ];
    await OPERATIVENOTESORDER_MODEL.insertMany(defaultNotes);
    }
  }

  async getAll() {
    await this.seedIfEmpty(); 
    return await OPERATIVENOTESORDER_MODEL.find().sort({ title: 1 });
  }

  async getById(id) {
    return await OPERATIVENOTESORDER_MODEL.findById(id);
  }

  async update(id, updateData) {
    return await OPERATIVENOTESORDER_MODEL.findByIdAndUpdate(id, updateData, { new: true });
  }
}

export default new Operative_notes_orderService();
