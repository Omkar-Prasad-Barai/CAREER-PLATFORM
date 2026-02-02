import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// @desc    Get currently logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get Profile Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

// @desc    Update currently logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update base fields
    user.fullName = req.body.fullName || user.fullName;

    // Update any role-specific fields that are sent
    // With discriminators, role fields are top-level on the document
    const { fullName, email, password, role, ...profileFields } = req.body;
    for (const [key, value] of Object.entries(profileFields)) {
      if (key in user.schema.paths) {
        user[key] = value;
      }
    }

    // Hash new password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.status(200).json(userObj);
  } catch (error) {
    console.error('Update Profile Error:', error.message);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// @desc    Get masked talent pool (seekers with sensitive data stripped)
// @route   GET /api/users/masked-talent
// @access  Private (Facilitators + Admin only)
export const getMaskedTalentPool = async (req, res) => {
  try {
    const maskedUsers = await User.find({
      role: { $in: ['student', 'aspirant'] },
    }).select('-password -email -fullName');

    res.status(200).json(maskedUsers);
  } catch (error) {
    console.error('Masked Talent Pool Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching talent pool' });
  }
};

// @desc    Get all registered users (Admin only)
// @route   GET /api/users/admin/all
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Get All Users Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch users.', error: error.message });
  }
};

// @desc    Upload resume PDF
// @route   POST /api/users/upload-resume
// @access  Private
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Normalize Windows backslashes → forward slashes for HTTP URLs
    const rawPath = req.file.path;
    const resumeUrl = rawPath.replace(/\\/g, '/');

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume: resumeUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({ resumeUrl, user });
  } catch (error) {
    console.error('Resume Upload Error:', error.message);
    res.status(500).json({ error: 'Failed to upload resume.' });
  }
};
