import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  getActiveAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';

const router = express.Router();

// @route   GET /api/announcements/active
// @access  Public
router.get('/active', getActiveAnnouncements);

// @route   GET /api/announcements
// @route   POST /api/announcements
// @access  Private (Admin only)
router
  .route('/')
  .get(protect, authorizeRoles('admin'), getAllAnnouncements)
  .post(protect, authorizeRoles('admin'), createAnnouncement);

// @route   PUT /api/announcements/:id
// @route   DELETE /api/announcements/:id
// @access  Private (Admin only)
router
  .route('/:id')
  .put(protect, authorizeRoles('admin'), updateAnnouncement)
  .delete(protect, authorizeRoles('admin'), deleteAnnouncement);

export default router;
