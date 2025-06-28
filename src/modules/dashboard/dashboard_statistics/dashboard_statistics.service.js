import { DashboardStatistics } from "./dashboard_statistics.model.js";
import { PATIENT_MASTER } from "../../patient_master/patient_master.model.js";

class Dashboard_statisticsService {

  async getAll() {
    const totalAdmittedPatients = await PATIENT_MASTER.countDocuments();
    const currentAdmittedPatients = await PATIENT_MASTER.countDocuments({ status: "Admitted" });
    const totalDischargedPatients = await PATIENT_MASTER.countDocuments({ status: "Discharged" });

    const stats = await DashboardStatistics.findOneAndUpdate(
      {},
      {
        totalAdmittedPatients,
        currentAdmittedPatients,
        totalDischargedPatients,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return stats;
  }
}

export default new Dashboard_statisticsService();
