import { Router } from 'express';
import UserController from './user.controller.js';
import validate from '../../middlewares/default/validate.js';
import rateLimiter from '../../middlewares/default/rateLimiter.js';
import { loginSchema, registerSchema } from './user.validator.js';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAll);
router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);
router.get('/:id', userController.getById);

export default router;
