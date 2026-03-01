import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getNotifications,
  markAllRead,
  markOneRead,
} from '../controllers/notificationController.js';

const router = express.Router();

// @route   GET /api/notifications
// @access  Private
router.get('/', protect, getNotifications);

// @route   PUT /api/notifications/mark-all-read
// @access  Private
router.put('/mark-all-read', protect, markAllRead);

// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, markOneRead);

export default router;
