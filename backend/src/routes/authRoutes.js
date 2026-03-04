import express from 'express';
import {
  register, registerValidation,
  login, loginValidation,
  forgotPassword, forgotPasswordValidation,
  resetPassword, resetPasswordValidation,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register',        registerValidation,       register);
router.post('/login',           loginValidation,          login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);

export default router;