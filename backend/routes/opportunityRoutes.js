import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  createOpportunity,
  getOpportunities,
  getMyOpportunities,
  deleteOpportunity,
} from '../controllers/opportunityController.js';

const router = express.Router();

// @route   GET /api/opportunities
// @access  Private (All logged-in users)
router.get('/', protect, getOpportunities);

// @route   GET /api/opportunities/mine
// @access  Private (Facilitators only)
router.get(
  '/mine',
  protect,
  authorizeRoles('organization', 'professor', 'professional', 'recruiter', 'others', 'admin'),
  getMyOpportunities
);

// @route   POST /api/opportunities
// @access  Private (Facilitators only)
router.post(
  '/',
  protect,
  authorizeRoles('organization', 'professor', 'professional', 'recruiter', 'others', 'admin'),
  createOpportunity
);

// @route   DELETE /api/opportunities/:id
// @access  Private (Owner or Admin)
router.delete('/:id', protect, deleteOpportunity);

export default router;
