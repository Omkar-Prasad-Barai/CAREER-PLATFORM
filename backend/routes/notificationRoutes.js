import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getNotifications,
  markAllRead,
  markOneRead,
  deleteNotification,
  clearAll,
} from '../controllers/notificationController.js';

const router = express.Router();

// @route   GET /api/notifications
// @access  Private
router.get('/', protect, getNotifications);

// @route   PUT /api/notifications/mark-all-read
// @access  Private
router.put('/mark-all-read', protect, markAllRead);

// @route   DELETE /api/notifications/clear-all
// @access  Private
router.delete('/clear-all', protect, clearAll);

// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, markOneRead);

// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', protect, deleteNotification);

export default router;
