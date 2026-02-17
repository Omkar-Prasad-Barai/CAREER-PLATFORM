import Testimonial from '../models/Testimonial.js';

// @desc    Create a new testimonial
// @route   POST /api/testimonials
// @access  Private
export const createTestimonial = async (req, res) => {
  try {
    const { company, role, quote, rating } = req.body;

    if (!company || !role || !quote) {
      return res.status(400).json({ message: 'Company, role, and testimonial text are required.' });
    }

    const testimonial = await Testimonial.create({
      userId: req.user._id,
      fullName: req.user.fullName,
      role,
      company,
      quote,
      rating: rating || 5,
      isApproved: true, // Auto-approve for MVP
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Create Testimonial Error:', error.message);
    res.status(500).json({ message: 'Failed to submit testimonial.' });
  }
};

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
export const getApprovedTestimonials = async (_req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-__v');

    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Get Testimonials Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch testimonials.' });
  }
};
