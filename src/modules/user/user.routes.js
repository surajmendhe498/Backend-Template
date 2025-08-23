import { Router } from 'express';
import UserController from './user.controller.js';
import validate from '../../middlewares/default/validate.js';
import rateLimiter from '../../middlewares/default/rateLimiter.js';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, updateSchema } from './user.validator.js';
import { uploadUserImage } from '../../helpers/user.upload.js'; 

const router = Router();
const userController = new UserController();

router.get('/', userController.getAll);
router.post('/register', uploadUserImage.single("photo"), validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);
router.get('/:id', userController.getById);
router.put('/:id', uploadUserImage.single("photo"), validate(updateSchema), userController.update);
router.delete('/:id', userController.delete);

router.post('/forgot-password', validate(forgotPasswordSchema), userController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), userController.resetPassword);

export default router;
