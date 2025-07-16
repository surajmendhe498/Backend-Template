import { DISCHARGEFIELDMASTER_MODEL } from "./discharge_field_master.model.js";

class Discharge_field_masterService {
  async getAll() {
  const count = await DISCHARGEFIELDMASTER_MODEL.countDocuments();
  if (count === 0) {
  const defaultFields = [
  { SummaryTitle: "CAUSE OF DEATH", summarySection: "", status: false },
  { SummaryTitle: "If Death then cause of death", summarySection: "", status: false },
  { SummaryTitle: "Cross Consultation", summarySection: "", status: false },
  { SummaryTitle: "Diagnosis", summarySection: "", status: false },
  { SummaryTitle: "Chief Complaints", summarySection: "", status: false },
  { SummaryTitle: "PAST HISTORY", summarySection: "", status: false },
  { SummaryTitle: "Course In Hospital", summarySection: "", status: false },
  { SummaryTitle: "Investigation", summarySection: "", status: false },
  { SummaryTitle: "Treatment Given / Operative Notes / Course in the Hospital", summarySection: "", status: false },
  { SummaryTitle: "Treatment Given", summarySection: "", status: false },
  { SummaryTitle: "Summary Title", summarySection: "", status: false },
  { SummaryTitle: "Treatment Advised", summarySection: "", status: false },
  { SummaryTitle: "Condition at the time of Discharge", summarySection: "", status: false },
  { SummaryTitle: "Advice at Discharge", summarySection: "", status: false },
  { SummaryTitle: "MLC No.", summarySection: "", status: false },
  { SummaryTitle: "Follow Up Date", summarySection: "", status: false },
  { SummaryTitle: "Advice On Follow Up", summarySection: "", status: false },
  { SummaryTitle: "Personal History", summarySection: "", status: false },
  { SummaryTitle: "Married Since", summarySection: "", status: false },
  { SummaryTitle: "Doctor Reg. No.", summarySection: "", status: false },
  { SummaryTitle: "Procedure Done", summarySection: "", status: false },
  { SummaryTitle: "ECG", summarySection: "", status: false },
  { SummaryTitle: "On Examination", summarySection: "", status: false },
  { SummaryTitle: "X-Ray Chest", summarySection: "", status: false },
  { SummaryTitle: "Other X-Ray", summarySection: "", status: false },
  { SummaryTitle: "2D ECHO", summarySection: "", status: false },
  { SummaryTitle: "USG", summarySection: "", status: false },
  { SummaryTitle: "CT SCAN", summarySection: "", status: false },
  { SummaryTitle: "Placenta", summarySection: "", status: false },
  { SummaryTitle: "Treatment Care Plan", summarySection: "", status: false },
  { SummaryTitle: "MRI SCAN", summarySection: "", status: false }
];
    await DISCHARGEFIELDMASTER_MODEL.insertMany(defaultFields);
  }
  return await DISCHARGEFIELDMASTER_MODEL.find();
}

  async update(id, updateData) {
    return await DISCHARGEFIELDMASTER_MODEL.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getById(id) {
    return await DISCHARGEFIELDMASTER_MODEL.findById(id);
  }
}

export default new Discharge_field_masterService();
