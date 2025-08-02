import DepartmentService from "./department.service.js";
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class DepartmentController {
  constructor() {
    this.departmentService = DepartmentService;
  }

  getAll = async (req, res, next) => {
    try {
      const departments = await this.departmentService.getAll();
      res.success("Departments fetched successfully", departments, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const department = await this.departmentService.getById(id);
      if (!department) return res.fail("Department not found", statusCode.NOT_FOUND);
      res.success("Department fetched successfully", department, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const department = await this.departmentService.create(req.body);
      res.success("Department created successfully", department, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await this.departmentService.update(id, req.body);
      if (!updated) return res.fail("Department not found", statusCode.NOT_FOUND);
      res.success("Department updated successfully", updated, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = await this.departmentService.delete(id);
      if (!deleted) return res.fail("Department not found", statusCode.NOT_FOUND);
      res.success("Department deleted successfully", deleted, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
