import Testimonial from '../models/Testimonial.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create a new testimonial
// @route   POST /api/testimonials
// @access  Private
// M-03 FIX: Testimonial Admin Approval Workflow — default to unapproved
export const createTestimonial = asyncHandler(async (req, res) => {
  const { company, role, quote, rating } = req.body;

  if (!company || !role || !quote) {
    return res.status(400).json({ success: false, message: 'Company, role, and testimonial text are required.' });
  }

  const testimonial = await Testimonial.create({
    userId: req.user._id,
    fullName: req.user.fullName,
    role,
    company,
    quote,
    rating: rating || 5,
    isApproved: false, // Changed from true to false for M-03 approval workflow
  });

  res.status(201).json({ 
    success: true, 
    message: 'Testimonial submitted and pending approval', 
    data: testimonial 
  });
});

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
export const getApprovedTestimonials = asyncHandler(async (req, res) => {
  // M-05 FIX: Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { isApproved: true };

  const testimonials = await Testimonial.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-__v');

  const total = await Testimonial.countDocuments(query);

  res.status(200).json({ 
    success: true, 
    data: testimonials,
    pagination: { total, page, pages: Math.ceil(total / limit), limit }
  });
});

// @desc    Get all pending testimonials (Admin only)
// @route   GET /api/testimonials/admin/pending
// @access  Private (Admin only)
// M-03 FIX: Added endpoint 
export const getPendingTestimonials = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { isApproved: false };

  const testimonials = await Testimonial.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Testimonial.countDocuments(query);

  res.status(200).json({ 
    success: true, 
    data: testimonials,
    pagination: { total, page, pages: Math.ceil(total / limit), limit }
  });
});

// @desc    Approve a testimonial (Admin only)
// @route   PUT /api/testimonials/:id/approve
// @access  Private (Admin only)
// M-03 FIX: Added endpoint 
export const approveTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }

  res.status(200).json({ success: true, message: 'Testimonial approved', data: testimonial });
});

// @desc    Reject/Delete a testimonial (Admin only)
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin only)
// M-03 FIX: Added endpoint 
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }

  res.status(200).json({ success: true, message: 'Testimonial deleted' });
});
