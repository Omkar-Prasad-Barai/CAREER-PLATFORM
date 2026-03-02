import Announcement from '../models/Announcement.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all active announcements (Usually for the top banner)
// @route   GET /api/announcements/active
// @access  Public
export const getActiveAnnouncements = asyncHandler(async (_req, res) => {
  const announcements = await Announcement.find({ isActive: true })
    .sort({ priority: -1, createdAt: -1 })
    .limit(5)
    .select('-__v');

  res.status(200).json({ success: true, data: announcements });
});

// @desc    Get all announcements (Paginated)
// @route   GET /api/announcements
// @access  Private (Admin only)
// M-02 FIX: Missing endpoints
export const getAllAnnouncements = asyncHandler(async (req, res) => {
  // M-05 FIX: Pagination added
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const announcements = await Announcement.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Announcement.countDocuments();

  res.status(200).json({ 
    success: true, 
    data: announcements,
    pagination: { total, page, pages: Math.ceil(total / limit), limit } 
  });
});

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private (Admin only)
// M-02 FIX: Missing endpoints
export const createAnnouncement = asyncHandler(async (req, res) => {
  const { message, emoji, isActive, priority } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Announcement message is required' });
  }

  const announcement = await Announcement.create({
    message,
    emoji: emoji || '🔥',
    isActive: isActive !== undefined ? isActive : true,
    priority: priority || 0,
  });

  res.status(201).json({ success: true, message: 'Announcement created', data: announcement });
});

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin only)
// M-02 FIX: Missing endpoints
export const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!announcement) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }

  res.status(200).json({ success: true, message: 'Announcement updated', data: announcement });
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin only)
// M-02 FIX: Missing endpoints
export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);

  if (!announcement) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }

  res.status(200).json({ success: true, message: 'Announcement deleted' });
});
