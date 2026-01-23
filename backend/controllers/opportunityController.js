import Opportunity from '../models/Opportunity.js';

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Private (Facilitators only)
export const createOpportunity = async (req, res) => {
  try {
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
      return res.status(400).json({ message: 'Title and Category are required.' });
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

    res.status(201).json(opportunity);
  } catch (error) {
    console.error('Create Opportunity Error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: `Validation failed: ${messages.join(', ')}` });
    }

    res.status(500).json({ message: error.message || 'Server error while creating opportunity' });
  }
};

// @desc    Get all active opportunities
// @route   GET /api/opportunities
// @access  Private (All logged-in users)
export const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ isActive: true })
      .populate('facilitatorId', 'fullName role companyName')
      .sort({ createdAt: -1 });

    res.status(200).json(opportunities);
  } catch (error) {
    console.error('Get Opportunities Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching opportunities' });
  }
};

// @desc    Get opportunities posted by the logged-in facilitator
// @route   GET /api/opportunities/mine
// @access  Private (Facilitators only)
export const getMyOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ facilitatorId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(opportunities);
  } catch (error) {
    console.error('Get My Opportunities Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching your opportunities' });
  }
};

// @desc    Delete an opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (Owner or Admin)
export const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Only the owner or admin can delete
    if (
      opportunity.facilitatorId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this opportunity' });
    }

    await opportunity.deleteOne();
    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Delete Opportunity Error:', error.message);
    res.status(500).json({ message: 'Server error while deleting opportunity' });
  }
};
