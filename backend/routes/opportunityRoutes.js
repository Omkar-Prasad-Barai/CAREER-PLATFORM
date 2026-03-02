import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  createOpportunity,
  getOpportunities,
  getMyOpportunities,
  updateOpportunity,
  deleteOpportunity,
} from '../controllers/opportunityController.js';
import { FACILITATOR_ROLES } from '../utils/constants.js';

const router = express.Router();

// @route   GET /api/opportunities
// @access  Private (All logged-in users)
router.get('/', protect, getOpportunities);

// @route   GET /api/opportunities/mine
// @access  Private (Facilitators only)
router.get(
  '/mine',
  protect,
  authorizeRoles(...FACILITATOR_ROLES),
  getMyOpportunities
);

// @route   POST /api/opportunities
// @access  Private (Facilitators only)
router.post(
  '/',
  protect,
  authorizeRoles(...FACILITATOR_ROLES),
  createOpportunity
);

// @route   PUT /api/opportunities/:id
// @access  Private (Owner only)
router.put('/:id', protect, authorizeRoles(...FACILITATOR_ROLES), updateOpportunity);

// @route   DELETE /api/opportunities/:id
// @access  Private (Owner or Admin)
router.delete('/:id', protect, deleteOpportunity);

export default router;
