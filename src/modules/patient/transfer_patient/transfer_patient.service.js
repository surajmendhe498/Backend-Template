import { PATIENT_MODEL } from '../patient.model.js';
import { FLOORMASTER_MODEL } from '../../hospital_master/ward_or_floor_master/ward_or_floor_master.model.js';
import { BEDMASTER_MODEL } from '../../hospital_master/bed_master/bed_master.model.js';
import { TRANSFER_MODEL } from './transfer_patient.model.js';

class TransferService {
  async transferPatient(patientId, transferData) {
    const patient = await PATIENT_MODEL.findById(patientId);
    if (!patient) throw new Error('Patient not found');

    if (
      String(patient.admissionDetails.floorDetails) !== transferData.currentFloor ||
      String(patient.admissionDetails.bedName) !== transferData.currentBed
    ) {
      throw new Error('Current floor or bed does not match patient record');
    }

    const newFloor = await FLOORMASTER_MODEL.findById(transferData.newFloor);
    if (!newFloor) throw new Error('New floor not found');

    const newBed = await BEDMASTER_MODEL.findById(transferData.newBed);
    if (!newBed) throw new Error('New bed not found');

    const fromFloor = await FLOORMASTER_MODEL.findById(transferData.currentFloor);
    const fromBed = await BEDMASTER_MODEL.findById(transferData.currentBed);

    patient.admissionDetails.floorDetails = newFloor._id;
    patient.admissionDetails.bedName = newBed._id;
    patient.admissionDetails.applicableClass = newBed.applicableClass;
    patient.admissionDetails.bedDepartment = newBed.department;

    patient.latestTransfer = {
      from: {
        floor: fromFloor?.floorName || 'Unknown',
        bed: fromBed?.bedName || 'Unknown',
      },
      to: {
        floor: newFloor.floorName,
        bed: newBed.bedName,
      },
      transferDate: transferData.transferDate,
      transferTime: transferData.transferTime,
    };

    await patient.save();

    await TRANSFER_MODEL.create({
      patient: patient._id,
      from: patient.latestTransfer.from,
      to: patient.latestTransfer.to,
      transferDate: transferData.transferDate,
      transferTime: transferData.transferTime,
    });

    const updatedPatient = await PATIENT_MODEL.findById(patientId)
      .populate('admissionDetails.floorDetails', 'floorName')
      .populate('admissionDetails.bedName', 'bedName');

    return updatedPatient;
  }

  async getTransferredPatients() {
  const transfers = await TRANSFER_MODEL.find()
    .populate('patient') 
    .populate('from.floor', 'floorName')
    .populate('from.bed', 'bedName')
    .populate('to.floor', 'floorName')
    .populate('to.bed', 'bedName');

  return transfers;
}

}

export default new TransferService();
