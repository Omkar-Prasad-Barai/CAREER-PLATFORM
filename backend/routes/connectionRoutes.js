import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  requestConnection,
  getPendingRequests,
  updateRequestStatus,
} from '../controllers/connectionController.js';

const router = express.Router();

// @route   POST /api/connections/request
// @access  Private (Seekers: student, aspirant)
router.post(
  '/request',
  protect,
  authorizeRoles('student', 'aspirant'),
  requestConnection
);

// @route   GET /api/connections/admin/pending
// @access  Private (Admin only)
router.get(
  '/admin/pending',
  protect,
  authorizeRoles('admin'),
  getPendingRequests
);

// @route   PUT /api/connections/admin/update/:id
// @access  Private (Admin only)
router.put(
  '/admin/update/:id',
  protect,
  authorizeRoles('admin'),
  updateRequestStatus
);

export default router;
