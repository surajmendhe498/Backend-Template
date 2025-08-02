import { Router } from 'express';
import DepartmentController from './department.controller.js';
import validate from '../../../middlewares/default/validate.js';
import { createDepartmentSchema, updateDepartmentSchema } from './department.validator.js';

const router = Router();
const departmentController = new DepartmentController();

router.get('/', departmentController.getAll);
router.post('/', validate(createDepartmentSchema), departmentController.create);
router.put('/:id', validate(updateDepartmentSchema), departmentController.update);
router.delete('/:id', departmentController.delete);
router.get('/:id', departmentController.getById);

export default router;
