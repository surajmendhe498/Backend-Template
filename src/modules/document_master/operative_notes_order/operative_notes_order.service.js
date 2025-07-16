import { OPERATIVENOTESORDER_MODEL } from './operative_notes_order.model.js';

class Operative_notes_orderService {
  async seedIfEmpty() {
    const count = await OPERATIVENOTESORDER_MODEL.countDocuments();
    if (count === 0) {
      const defaultNotes = [
  { title: "Name of Surgery", otherTitle: "", status: false },
  { title: "Diagnosis", otherTitle: "", status: false },
  { title: "Procedure Grade", otherTitle: "", status: false },
  { title: "Category", otherTitle: "", status: false },
  { title: "Surgery Date & Time", otherTitle: "", status: false },
  { title: "Primary Surgeon", otherTitle: "", status: false },
  { title: "Associate Surgeon", otherTitle: "", status: false },
  { title: "Assistant Surgeon", otherTitle: "", status: false },
  { title: "Anaesthetist", otherTitle: "", status: false },
  { title: "Nurse", otherTitle: "", status: false },
  { title: "Preoperative Assessment", otherTitle: "", status: false },
  { title: "Anesthesia Notes", otherTitle: "", status: false },
  { title: "Operative Procedure", otherTitle: "", status: false },
  { title: "Postoperative Instructions", otherTitle: "", status: false },
  { title: "Incision", otherTitle: "", status: false },
  { title: "Part Preparation", otherTitle: "", status: false },
  { title: "Drain", otherTitle: "", status: false },
  { title: "Biopsy", otherTitle: "", status: false },
  { title: "Dressing", otherTitle: "", status: false },
  { title: "Suturing", otherTitle: "", status: false },
  { title: "Comments", otherTitle: "", status: false },
  { title: "Postoperative Instruction", otherTitle: "", status: false },
  { title: "Blood Group", otherTitle: "", status: false },
  { title: "Blood Loss", otherTitle: "", status: false },
  { title: "Blood Transfusion", otherTitle: "", status: false },
  { title: "Histo Pathology Sample Sent to", otherTitle: "", status: false },
  { title: "Preoperative Diagnosis", otherTitle: "", status: false },
  { title: "Postoperative Diagnosis", otherTitle: "", status: false },
  { title: "Surgery Performed", otherTitle: "", status: false },
  { title: "Specimen For Histology/Pathology", otherTitle: "", status: false },
  { title: "Indication", otherTitle: "", status: false },
  { title: "Indication of Surgery", otherTitle: "", status: false },
  { title: "Sponge Count", otherTitle: "", status: false },
  { title: "Instrument Court", otherTitle: "", status: false },
  { title: "Operative Consent", otherTitle: "", status: false },
  { title: "Operative Notes Other", otherTitle: "", status: false },
  { title: "Treatment Given", otherTitle: "", status: false },
  { title: "Display Inside DIscharge Summary", otherTitle: "", status: false },
  { title: "Type of Surgery", otherTitle: "", status: false },
  { title: "Assistant Nurse", otherTitle: "", status: false },
  { title: "Additional Surgery", otherTitle: "", status: false },
  { title: "Additional Surgery Performed", otherTitle: "", status: false },
  { title: "OP Report", otherTitle: "", status: false },
  { title: "Anesthesia", otherTitle: "", status: false },
  { title: "Positioning", otherTitle: "", status: false },
  { title: "Surgical Procedure", otherTitle: "", status: false },
  { title: "Steps", otherTitle: "", status: false },
  { title: "Post OP Orders", otherTitle: "", status: false },
  { title: "Baby Notes", otherTitle: "", status: false }
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
