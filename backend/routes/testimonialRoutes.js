import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { 
  createTestimonial, 
  getApprovedTestimonials,
  getPendingTestimonials,
  approveTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';

const router = express.Router();

// @route   GET /api/testimonials
// @access  Public
router.get('/', getApprovedTestimonials);

// @route   POST /api/testimonials
// @access  Private
router.post('/', protect, createTestimonial);

// @route   GET /api/testimonials/admin/pending
// @access  Private (Admin only)
router.get('/admin/pending', protect, authorizeRoles('admin'), getPendingTestimonials);

// @route   PUT /api/testimonials/:id/approve
// @access  Private (Admin only)
router.put('/:id/approve', protect, authorizeRoles('admin'), approveTestimonial);

// @route   DELETE /api/testimonials/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorizeRoles('admin'), deleteTestimonial);

export default router;
