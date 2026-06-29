import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  refreshToken,
  uploadProfilePicture,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail
} from '../controllers/authController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

const registerValidation = [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const loginValidation = [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
];

router.post('/register', validate(registerValidation), registerUser);
router.post('/login', validate(loginValidation), loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post('/profile/upload', protect, upload.single('image'), uploadProfilePicture);
router.put('/profile/password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

export default router;
