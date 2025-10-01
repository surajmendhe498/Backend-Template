import { PATIENT_MODEL } from '../patient.model.js';
import { FLOORMASTER_MODEL } from '../../hospital_master/ward_or_floor_master/ward_or_floor_master.model.js';
import { BEDMASTER_MODEL } from '../../hospital_master/bed_master/bed_master.model.js';
import { TRANSFER_MODEL } from './transfer_patient.model.js';
import { EXCHANGE_MODEL } from "./exchange_patient.model.js";
import { ASSIGN_MODEL } from "./assign_patient.model.js";

class TransferService {

async transferPatient(patientId, transferData) {
  const patient = await PATIENT_MODEL.findById(patientId);
  if (!patient) throw new Error('Patient not found');

  const admissionId = transferData.admissionId;
  const admissionEntry = patient.admissionDetails.find(
    (admission) => admission._id.toString() === admissionId
  );

  if (!admissionEntry) {
    throw new Error('Admission detail not found for given admissionId');
  }

  if (
    String(admissionEntry.floorId) !== transferData.currentFloor ||
    String(admissionEntry.bedId) !== transferData.currentBed
  ) {
    throw new Error('Current floor or bed does not match patient record');
  }

  // --- Validate New Floor and Bed Exist ---
  const newFloor = await FLOORMASTER_MODEL.findById(transferData.newFloor);
  if (!newFloor) throw new Error('New floor not found');

  const newBed = await BEDMASTER_MODEL.findById(transferData.newBed);
  if (!newBed) throw new Error('New bed not found');

  const fromFloor = await FLOORMASTER_MODEL.findById(transferData.currentFloor);
  const fromBed = await BEDMASTER_MODEL.findById(transferData.currentBed);

  const latestTransfer = {
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

  admissionEntry.floorId = newFloor._id;
  admissionEntry.bedId = newBed._id;
  // admissionEntry.applicableClass = newBed.applicableClass;
  // admissionEntry.bedDepartment = newBed.department;

  await patient.save();

  await TRANSFER_MODEL.create({
    patient: patient._id,
    admissionId: transferData.admissionId,
    from: latestTransfer.from,
    to: latestTransfer.to,
    transferDate: transferData.transferDate,
    transferTime: transferData.transferTime,
  });

  const updatedPatient = await PATIENT_MODEL.findById(patientId)
  .populate('admissionDetails.floorId', 'floorName')
  .populate('admissionDetails.bedId', 'bedName')
  .lean();

const matchedAdmission = updatedPatient.admissionDetails.find(
  (admission) => admission._id.toString() === transferData.admissionId
);

const response = {
  _id: updatedPatient._id,
  identityDetails: updatedPatient.identityDetails,
  admissionDetails: matchedAdmission ? [matchedAdmission] : [],
  latestTransfer,
};
  return response;
}


async getTransferredPatients() {
  const transfers = await TRANSFER_MODEL.find()
    .populate('patient', 'identityDetails.patientName') 
    .populate('from.floor', 'floorName')
    .populate('from.bed', 'bedName')
    .populate('to.floor', 'floorName')
    .populate('to.bed', 'bedName')
    .lean();

  const formattedTransfers = transfers.map(transfer => ({
    _id: transfer._id,
    patient: transfer.patient ? {
      _id: transfer.patient._id,
      patientName: transfer.patient.identityDetails?.patientName || null
    } : null,
    admissionId: transfer.admissionId,
    from: transfer.from,
    to: transfer.to,
    transferDate: transfer.transferDate,
    transferTime: transfer.transferTime,
    createdAt: transfer.createdAt,
    updatedAt: transfer.updatedAt
  }));

  return formattedTransfers;
}


async getTransferHistoryByPatientId(patientId) {
  const transfers = await TRANSFER_MODEL.find({ patient: patientId })
    .populate('patient', 'identityDetails.patientName') 
    .populate('from.floor', 'floorName')
    .populate('from.bed', 'bedName')
    .populate('to.floor', 'floorName')
    .populate('to.bed', 'bedName')
    .lean();

  if (!transfers.length) {
    throw new Error('No transfer history found for this patient');
  }

  const formattedTransfers = transfers.map(transfer => ({
    _id: transfer._id,
    patient: transfer.patient ? {
      _id: transfer.patient._id,
      patientName: transfer.patient.identityDetails?.patientName || null
    } : null,
    admissionId: transfer.admissionId,
    from: transfer.from,
    to: transfer.to,
    transferDate: transfer.transferDate,
    transferTime: transfer.transferTime,
    createdAt: transfer.createdAt,
    updatedAt: transfer.updatedAt
  }));

  return formattedTransfers;
}

// async getHistoryByPatientAndAdmission(patientId, admissionId) {
//   // --- Fetch Transfer History ---
//   const transfers = await TRANSFER_MODEL.find({
//     patient: patientId,
//     admissionId: admissionId,
//   }).lean();

//   const formattedTransfers = transfers.map(t => ({
//     type: "Transfer",
//     from: t.from,
//     to: t.to,
//     date: t.transferDate,
//     time: t.transferTime,
//     createdAt: t.createdAt
//   }));

//   // --- Fetch Exchange History ---
//   const exchanges = await EXCHANGE_MODEL.find({
//     $or: [
//       { patientA: patientId, admissionAId: admissionId },
//       { patientB: patientId, admissionBId: admissionId }
//     ]
//   }).lean();

//   const formattedExchanges = exchanges.map(e => {
//     const isPatientA = e.patientA.toString() === patientId.toString() &&
//                        e.admissionAId.toString() === admissionId.toString();

//     return {
//       type: "Exchange",
//       from: isPatientA ? e.fromA : e.fromB,
//       to: isPatientA ? e.toA : e.toB,
//       date: e.exchangeDate,
//       time: e.exchangeTime,
//       createdAt: e.createdAt
//     };
//   });

//   // --- Merge & Sort by createdAt (latest first) ---
//   const history = [...formattedTransfers, ...formattedExchanges].sort(
//     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   );

//   return history;
// }

// async getHistoryByPatientAndAdmission(patientId, admissionId) {
//   // --- Fetch Transfer History ---
//   const transfers = await TRANSFER_MODEL.find({
//     patient: patientId,
//     admissionId: admissionId,
//   }).lean();

//   const formattedTransfers = transfers.map(t => ({
//     type: "Transfer",
//     from: t.from,
//     to: t.to,
//     date: t.transferDate,
//     time: t.transferTime,
//     createdAt: t.createdAt
//   }));

//   // --- Fetch Exchange History ---
//   const exchanges = await EXCHANGE_MODEL.find({
//     $or: [
//       { patientA: patientId, admissionAId: admissionId },
//       { patientB: patientId, admissionBId: admissionId }
//     ]
//   }).lean();

//   const formattedExchanges = exchanges.map(e => {
//   return [
//     {
//       type: "Exchange",
//       patientId: e.patientA,
//       admissionId: e.admissionAId,
//       from: e.fromA,
//       to: e.toA,
//       date: e.exchangeDate,
//       time: e.exchangeTime,
//       createdAt: e.createdAt
//     },
//     {
//       type: "Exchange",
//       patientId: e.patientB,
//       admissionId: e.admissionBId,
//       from: e.fromB,
//       to: e.toB,
//       date: e.exchangeDate,
//       time: e.exchangeTime,
//       createdAt: e.createdAt
//     }
//   ];
// });

// // Flatten the array to merge with transfers
// const history = [
//   ...formattedTransfers,
//   ...formattedExchanges.flat()
// ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// return history;

// }



async getHistoryByPatientAndAdmission(patientId, admissionId) {
  // --- Transfer ---
  const transfers = await TRANSFER_MODEL.find({ patient: patientId, admissionId }).lean();
  const formattedTransfers = transfers.map(t => ({
    type: "Transfer",
    from: t.from,
    to: t.to,
    date: t.transferDate,
    time: t.transferTime,
    createdAt: t.createdAt
  }));

  // --- Exchange ---
  const exchanges = await EXCHANGE_MODEL.find({
    $or: [
      { patientA: patientId, admissionAId: admissionId },
      { patientB: patientId, admissionBId: admissionId }
    ]
  }).lean();

  const formattedExchanges = exchanges.map(e => ([
    {
      type: "Exchange",
      patientId: e.patientA,
      admissionId: e.admissionAId,
      from: e.fromA,
      to: e.toA,
      date: e.exchangeDate,
      time: e.exchangeTime,
      createdAt: e.createdAt
    },
    {
      type: "Exchange",
      patientId: e.patientB,
      admissionId: e.admissionBId,
      from: e.fromB,
      to: e.toB,
      date: e.exchangeDate,
      time: e.exchangeTime,
      createdAt: e.createdAt
    }
  ])).flat();

  // --- Assign ---
  const assigns = await ASSIGN_MODEL.find({ patient: patientId, admissionId }).lean();
  const formattedAssigns = assigns.map(a => ({
    type: "Assign",
    from: a.from,
    to: a.to,
    date: a.assignDate,
    time: a.assignTime,
    createdAt: a.createdAt
  }));

  // --- Merge & Sort ---
  const history = [...formattedTransfers, ...formattedExchanges, ...formattedAssigns].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return history;
}

}

export default new TransferService();
