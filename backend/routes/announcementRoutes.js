import express from 'express';
import { getActiveAnnouncements } from '../controllers/announcementController.js';

const router = express.Router();

// @route   GET /api/announcements/active
// @access  Public
router.get('/active', getActiveAnnouncements);

export default router;
