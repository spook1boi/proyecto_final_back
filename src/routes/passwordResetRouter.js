import express from 'express';
import PasswordResetController from '../controllers/PasswordResetController.js';

const router = express.Router();
const passwordResetController = new PasswordResetController();

router.post('/password-reset/request', passwordResetController.requestPasswordReset);

router.post('/password-reset/reset', passwordResetController.resetPassword);

export default router;