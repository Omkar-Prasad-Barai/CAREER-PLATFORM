import Opportunity from '../models/Opportunity.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Private (Facilitators only)
export const createOpportunity = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    type,
    jobType,
    stipendOrSalary,
    duration,
    eligibility,
    skillsRequired,
  } = req.body;

  if (!title || !category) {
    return res.status(400).json({ success: false, message: 'Title and Category are required.' });
  }

  const opportunity = await Opportunity.create({
    facilitatorId: req.user._id,
    title,
    description: description || '',
    category,
    type: type || (jobType === 'Internship' ? 'Internship' : 'Full-time'),
    jobType: jobType || '',
    stipendOrSalary: stipendOrSalary || '',
    duration: duration || '',
    eligibility: eligibility || '',
    skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
  });

  // Populate the facilitator info before returning
  await opportunity.populate('facilitatorId', 'fullName role companyName');

  res.status(201).json({ success: true, message: 'Opportunity created successfully', data: opportunity });
});

// @desc    Get all active opportunities
// @route   GET /api/opportunities
// @access  Private (All logged-in users)
export const getOpportunities = asyncHandler(async (req, res) => {
  // M-05 FIX: Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { isActive: true };

  const opportunities = await Opportunity.find(query)
    .populate('facilitatorId', 'fullName role companyName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Opportunity.countDocuments(query);

  res.status(200).json({ 
    success: true, 
    data: opportunities,
    pagination: { total, page, pages: Math.ceil(total / limit), limit } 
  });
});

// @desc    Get opportunities posted by the logged-in facilitator
// @route   GET /api/opportunities/mine
// @access  Private (Facilitators only)
export const getMyOpportunities = asyncHandler(async (req, res) => {
  // M-05 FIX: Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { facilitatorId: req.user._id };

  const opportunities = await Opportunity.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Opportunity.countDocuments(query);

  res.status(200).json({ 
    success: true, 
    data: opportunities, 
    pagination: { total, page, pages: Math.ceil(total / limit), limit } 
  });
});

// @desc    Update an opportunity
// @route   PUT /api/opportunities/:id
// @access  Private (Owner only)
export const updateOpportunity = asyncHandler(async (req, res) => {
  // M-01 FIX: Add updateOpportunity endpoint
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    return res.status(404).json({ success: false, message: 'Opportunity not found' });
  }

  // Only the owner can update
  if (opportunity.facilitatorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this opportunity' });
  }

  const updatedOpportunity = await Opportunity.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  ).populate('facilitatorId', 'fullName role companyName');

  res.status(200).json({ success: true, message: 'Opportunity updated successfully', data: updatedOpportunity });
});

// @desc    Delete an opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (Owner or Admin)
export const deleteOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    return res.status(404).json({ success: false, message: 'Opportunity not found' });
  }

  // Only the owner or admin can delete
  if (
    opportunity.facilitatorId.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this opportunity' });
  }

  await opportunity.deleteOne();
  res.status(200).json({ success: true, message: 'Opportunity deleted successfully' });
});
