import Announcement from '../models/Announcement.js';

// @desc    Get all active announcements
// @route   GET /api/announcements/active
// @access  Public
export const getActiveAnnouncements = async (_req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ priority: -1, createdAt: -1 })
      .limit(5)
      .select('-__v');

    res.status(200).json(announcements);
  } catch (error) {
    console.error('Get Announcements Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch announcements.' });
  }
};
