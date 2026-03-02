import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get currently logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Update currently logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // B-07 FIX: Require current password if user is trying to change their password
  if (req.body.password) {
    if (!req.body.currentPassword) {
      return res.status(400).json({ success: false, message: 'Please provide your current password to set a new password.' });
    }
    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  // Update base fields
  user.fullName = req.body.fullName || user.fullName;

  // Update any role-specific fields that are sent
  const { fullName, email, password, currentPassword, role, ...profileFields } = req.body;
  for (const [key, value] of Object.entries(profileFields)) {
    if (key in user.schema.paths) {
      user[key] = value;
    }
  }

  const updatedUser = await user.save();
  const userObj = updatedUser.toObject();
  delete userObj.password;

  res.status(200).json({ success: true, message: 'Profile updated successfully', data: userObj });
});

// @desc    Get masked talent pool (seekers with sensitive data stripped)
// @route   GET /api/users/masked-talent
// @access  Private (Facilitators + Admin only)
export const getMaskedTalentPool = asyncHandler(async (req, res) => {
  // M-05 FIX: Pagination added
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { role: { $in: ['student', 'aspirant'] } };

  const maskedUsers = await User.find(query)
    .select('-password -email -fullName')
    .skip(skip)
    .limit(limit);
    
  const total = await User.countDocuments(query);

  res.status(200).json({ 
    success: true, 
    data: maskedUsers,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    }
  });
});

// @desc    Get all registered users (Admin only)
// @route   GET /api/users/admin/all
// @access  Private (Admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await User.countDocuments();

  res.status(200).json({ 
    success: true, 
    data: users,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    }
  });
});

// @desc    Upload resume PDF
// @route   POST /api/users/upload-resume
// @access  Private
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  // Normalize Windows backslashes → forward slashes for HTTP URLs
  const rawPath = req.file.path;
  const resumeUrl = rawPath.replace(/\\/g, '/');

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { resume: resumeUrl },
    { new: true }
  ).select('-password');

  res.status(200).json({ success: true, message: 'Resume uploaded', resumeUrl, data: user });
});
