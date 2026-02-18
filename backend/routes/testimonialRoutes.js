import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createTestimonial, getApprovedTestimonials } from '../controllers/testimonialController.js';

const router = express.Router();

// @route   GET /api/testimonials
// @access  Public
router.get('/', getApprovedTestimonials);

// @route   POST /api/testimonials
// @access  Private
router.post('/', protect, createTestimonial);

export default router;
