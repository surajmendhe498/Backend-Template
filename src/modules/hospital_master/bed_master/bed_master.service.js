import { BEDMASTER_MODEL } from './bed_master.model.js';
import { FLOORMASTER_MODEL } from '../ward_or_floor_master/ward_or_floor_master.model.js';
import { DEPARTMENT_MODEL } from '../department/department.model.js';
import { WARDMASTER_MODEL } from '../ward_master/ward_master.model.js';
import { PATIENT_MODEL } from '../../patient/patient.model.js';

class Bed_masterService {
  async getAll() {
    return await BEDMASTER_MODEL.find()
      .populate('floorId', 'floorName')
      .populate('departmentId', 'name')
      .populate('wardId', 'wardName');
  }

  async create(data) {
  const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
  if (!floorExists) {
    throw new Error('Floor with the given ID does not exist');
  }

  const departmentExists = await DEPARTMENT_MODEL.findById(data.departmentId);
  if (!departmentExists) {
    throw new Error('Department with the given ID does not exist');
  }

  const wardExists = await WARDMASTER_MODEL.findById(data.wardId);
  if (!wardExists) {
    throw new Error('Ward with the given ID does not exist');
  }

  const newBed = await BEDMASTER_MODEL.create(data);

  return await BEDMASTER_MODEL.findById(newBed._id)
    .populate('floorId', 'floorName')
    .populate('departmentId', 'name')
    .populate('wardId', 'wardName');
}


  async update(id, data) {
    if (data.floorId) {
      const floorExists = await FLOORMASTER_MODEL.findById(data.floorId);
      if (!floorExists) {
        throw new Error('Floor with the given ID does not exist');
      }
    }

    if (data.departmentId) {
      const departmentExists = await DEPARTMENT_MODEL.findById(data.departmentId);
      if (!departmentExists) {
        throw new Error('Department with the given ID does not exist');
      }
    }

    if (data.wardId) {
      const wardExists = await WARDMASTER_MODEL.findById(data.wardId);
      if (!wardExists) {
        throw new Error('Ward with the given ID does not exist');
      }
    }

    return await BEDMASTER_MODEL.findByIdAndUpdate(id, data, { new: true })
      .populate('floorId', 'floorName')
      .populate('departmentId', 'name')
      .populate('wardId', 'wardName');
  }

  async getBedsByStatus(status) {
    return await BEDMASTER_MODEL.find({ bedStatus: status })
    .populate('floorId', 'floorName')
    .populate('departmentId', 'name')
    .populate('wardId', 'wardName')
  }

  async filterBeds(query) {
  const filters = {};

  filters.applicableClass = query.selectClass || query.applicableClass;
  filters.status = query.selectStatus || query.status;
  filters.bedStatus = query.selectOccupancy || query.bedStatus;

  Object.keys(filters).forEach((key) => {
    if (!filters[key]) delete filters[key];
  });

  return await BEDMASTER_MODEL.find(filters)
    .select('floorId bedName applicableClass bedStatus status')
    .populate('floorId', 'floorName')
    .populate('departmentId', 'name')
    .populate('wardId', 'wardName')
}

async getById(id) {
  return await BEDMASTER_MODEL.findById(id)
    .populate('floorId', 'floorName')
    .populate('departmentId', 'name')
    .populate('wardId', 'wardName'); 
}

async getAllBedsWithPatient() {
  const beds = await BEDMASTER_MODEL.find()
    .populate("floorId", "floorName")
    .populate("departmentId", "name")
    .populate("wardId", "wardName");

  const result = await Promise.all(
    beds.map(async (bed) => {

      const patient = await PATIENT_MODEL.findOne(
        { "admissionDetails.bedId": bed._id },
        {
          _id: 1,
          "identityDetails.patientName": 1,
          "admissionDetails._id": 1,
          "admissionDetails.bedId": 1,
        }
      ).lean();

      let occupiedBy = null;

      if (patient) {
        const admissionId = patient.admissionDetails
          .filter((adm) => adm.bedId?.toString() === bed._id.toString())
          .map((adm) => adm._id);

        occupiedBy = {
          patientId: patient._id,
          name: patient.identityDetails.patientName,
          admissionId: admissionId,
        };
      }

      return {
        ...bed.toObject(),
        occupiedBy,
      };
    })
  );

  return result;
}

}

export default new Bed_masterService();
