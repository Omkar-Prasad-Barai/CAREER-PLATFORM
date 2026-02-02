import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { resumeUpload, handleMulterError } from '../middlewares/upload.js';
import {
  getUserProfile,
  updateUserProfile,
  getMaskedTalentPool,
  getAllUsers,
  uploadResume,
} from '../controllers/userController.js';

const router = express.Router();

// @route   GET /api/users/profile
// @access  Private (Any logged-in user)
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
// @access  Private (Any logged-in user)
router.put('/profile', protect, updateUserProfile);

// @route   POST /api/users/upload-resume
// @access  Private
router.post(
  '/upload-resume',
  protect,
  resumeUpload.single('resume'),
  handleMulterError,
  uploadResume
);

// @route   GET /api/users/masked-talent
// @access  Private (Facilitators + Admin only)
router.get(
  '/masked-talent',
  protect,
  authorizeRoles('organization', 'professor', 'recruiter', 'professional', 'others', 'admin'),
  getMaskedTalentPool
);

// @route   GET /api/users/admin/all
// @access  Private (Admin only)
router.get(
  '/admin/all',
  protect,
  authorizeRoles('admin'),
  getAllUsers
);

export default router;
