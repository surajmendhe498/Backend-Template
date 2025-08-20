import { Router } from 'express';
import UserController from './user.controller.js';
import validate from '../../middlewares/default/validate.js';
import rateLimiter from '../../middlewares/default/rateLimiter.js';
import { loginSchema, registerSchema, updateSchema } from './user.validator.js';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAll);
router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);
router.get('/:id', userController.getById);
router.put('/:id', validate(updateSchema), userController.update);
router.delete('/:id', userController.delete);


export default router;
