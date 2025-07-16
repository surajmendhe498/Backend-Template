import { ADMISSION_REASON_MODEL } from "./admissionreasons.model.js";

class AdmissionreasonsService {

  async seedIfEmpty() {
  const count = await ADMISSION_REASON_MODEL.countDocuments();
  if (count === 0) {
    const reasons = [
      { admissionReason: 'Medical' },
      { admissionReason: 'Surgical' },
      { admissionReason: 'DayCare' },
      { admissionReason: 'Casualty' },
      { admissionReason: 'Paediatrics' },
      { admissionReason: 'Gynac' },
      { admissionReason: 'Obstatrics' },
      { admissionReason: 'OBGY Nursing' },
      { admissionReason: 'NICU Shifted' },
      { admissionReason: 'New Born' },
      { admissionReason: 'Chimo' },
      { admissionReason: 'Covid 19' },
      { admissionReason: 'Pristyn Care' },
      { admissionReason: 'Nursing Care / Wound Care' },
      { admissionReason: 'Prolonged Acute Care' },
      { admissionReason: 'Post Hospitalization Care' },
      { admissionReason: 'ENT' },
      { admissionReason: 'Dialysis' },
      { admissionReason: 'Emergency Room' },
      { admissionReason: 'BornMarrow Transplant' },
      { admissionReason: 'Blood Trasnfusion' },
      { admissionReason: 'Opthal' },
      { admissionReason: 'CAG' },
      { admissionReason: 'PTCA' },
      { admissionReason: 'Medical Emergency' },
      { admissionReason: 'Routine' },
      { admissionReason: 'PPI' },
      { admissionReason: 'AV Fistula' },
      { admissionReason: 'Permenant Tunnel Catheter' },
      { admissionReason: 'TURP' },
      { admissionReason: 'PCNL' },
      { admissionReason: 'DJ Standing' },
      { admissionReason: 'CABG' },
      { admissionReason: 'TKR' },
      { admissionReason: 'TROTHCOPY DIGNOSTIC' },
      { admissionReason: 'DSA' },
      { admissionReason: 'SPINAL FUSION' },
      { admissionReason: 'IVS FILTER' },
      { admissionReason: 'INTRA ARTRAIL THOMBILISIS' },
      { admissionReason: 'ENDO LASER' },
      { admissionReason: 'FTND' },
      { admissionReason: 'LSCS' },
      { admissionReason: 'MTP' },
      { admissionReason: 'S & E' },
      { admissionReason: 'Examination Under Anesthesia' },
      { admissionReason: 'Hysterectomy' },
      { admissionReason: 'Conservative Managment' },
      { admissionReason: 'D & C' },
      { admissionReason: 'Myomectomy' },
      { admissionReason: 'Hysteroleproscopy' },
      { admissionReason: 'Medical Oncology' },
      { admissionReason: 'Camp' },
      { admissionReason: 'Orthopadic' },
      { admissionReason: 'UROSurgeory' },
      { admissionReason: 'Oncosurgeory' },
      { admissionReason: 'FERTILITY' },
      { admissionReason: 'CHILD NEROLOGY' },
      { admissionReason: 'NEURODEVELOPMENT' },
      { admissionReason: 'BEHAVIOUR' },
      { admissionReason: 'OPU' },
      { admissionReason: 'IUI' },
      { admissionReason: 'ET' },
      { admissionReason: 'PSH' },
      { admissionReason: 'IPD' },
      { admissionReason: 'Specail Camp' },
      { admissionReason: 'Medical IPD + Surgery' },
      { admissionReason: 'OPD Basis' },
      { admissionReason: 'LNT (IPD)' },
      { admissionReason: 'D & E' },
      { admissionReason: 'Emergency Care' },
      { admissionReason: 'Lap. appendicectomy' },
      { admissionReason: 'Lap.cholecystectomy' },
      { admissionReason: 'Lap. TEP' },
      { admissionReason: 'LAP E. TEP' }
    ];
    await ADMISSION_REASON_MODEL.insertMany(reasons);
  }
}


  async getAll() {
    return await ADMISSION_REASON_MODEL.find();
  }

}

export default new AdmissionreasonsService();
