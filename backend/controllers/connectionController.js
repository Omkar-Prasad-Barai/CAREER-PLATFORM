import ConnectionRequest from '../models/ConnectionRequest.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendEmail } from '../services/emailService.js';
import * as emailTemplates from '../services/emailTemplates.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Seeker requests a connection with a facilitator
// @route   POST /api/connections/request
// @access  Private (Seekers: student, aspirant)
export const requestConnection = asyncHandler(async (req, res) => {
  const { facilitatorId, opportunityId } = req.body;
  const seekerId = req.user._id;

  // Prevent duplicate requests for the same seeker-facilitator-opportunity combo
  const existing = await ConnectionRequest.findOne({
    seekerId,
    facilitatorId,
    ...(opportunityId && { opportunityId }),
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'A connection request already exists for this facilitator/opportunity',
    });
  }

  const connectionRequest = await ConnectionRequest.create({
    seekerId,
    facilitatorId,
    ...(opportunityId && { opportunityId }),
    status: 'pending_admin',
  });

  res.status(201).json({
    success: true,
    message: 'Request sent to Admin for approval',
    data: connectionRequest,
  });
});

// @desc    Admin fetches all pending connection requests
// @route   GET /api/connections/admin/pending
// @access  Private (Admin only)
export const getPendingRequests = asyncHandler(async (req, res) => {
  // M-05 FIX: Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { status: 'pending_admin' };

  const pendingRequests = await ConnectionRequest.find(query)
    .populate('seekerId', 'fullName email profileDetails')
    .populate('facilitatorId', 'fullName email')
    .populate('opportunityId', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await ConnectionRequest.countDocuments(query);

  res.status(200).json({
    success: true,
    data: pendingRequests,
    pagination: { total, page, pages: Math.ceil(total / limit), limit }
  });
});

// @desc    Admin approves or rejects a connection request
// @route   PUT /api/connections/admin/update/:id
// @access  Private (Admin only)
export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: "Status must be 'approved' or 'rejected'" });
  }

  const connectionRequest = await ConnectionRequest.findById(req.params.id)
    .populate('seekerId', 'fullName email')
    .populate('facilitatorId', 'fullName email')
    .populate('opportunityId', 'title');

  if (!connectionRequest) {
    return res.status(404).json({ success: false, message: 'Connection request not found' });
  }

  connectionRequest.status = status;
  if (adminNotes) connectionRequest.adminNotes = adminNotes;
  await connectionRequest.save();

  const seeker = connectionRequest.seekerId;
  const facilitator = connectionRequest.facilitatorId;
  const opportunityTitle = connectionRequest.opportunityId?.title || 'an opportunity';

  // B-01 FIX: Create in-app Notification documents for both parties
  const notificationPromises = [];

  if (status === 'approved') {
    notificationPromises.push(
      Notification.create({
        userId: seeker._id,
        type: 'connection_approved',
        message: `Your connection with ${facilitator.fullName} for "${opportunityTitle}" has been approved!`,
        link: '/dashboard',
      }),
      Notification.create({
        userId: facilitator._id,
        type: 'new_applicant',
        message: `${seeker.fullName} has been connected to you for "${opportunityTitle}".`,
        link: '/dashboard',
      })
    );
  } else {
    notificationPromises.push(
      Notification.create({
        userId: seeker._id,
        type: 'application_update',
        message: `Your connection request for "${opportunityTitle}" was not approved.${adminNotes ? ` Reason: ${adminNotes}` : ''}`,
        link: '/dashboard',
      })
    );
  }

  // Fire-and-forget notifications — never block the response
  Promise.all(notificationPromises).catch((err) =>
    console.error('[Notification] Creation error:', err.message)
  );

  // Send notification emails on approval (non-blocking)
  if (status === 'approved') {
    const platformUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // B-02 FIX: Use Promise.all (can reject) instead of Promise.allSettled (never rejects)
    Promise.all([
      sendEmail({
        to: seeker.email,
        subject: '🎉 Your Connection Has Been Approved — CareerConnect',
        html: emailTemplates.connectionApprovedSeeker({
          seekerName: seeker.fullName,
          facilitatorName: facilitator.fullName,
          opportunityTitle,
          platformUrl,
        }),
      }),
      sendEmail({
        to: facilitator.email,
        subject: `✅ New Connection Approved — ${seeker.fullName} is Connected to You`,
        html: emailTemplates.connectionApprovedFacilitator({
          facilitatorName: facilitator.fullName,
          seekerName: seeker.fullName,
          seekerProfile: seeker._id,
          opportunityTitle,
          platformUrl,
        }),
      }),
    ]).catch((err) => console.error('[Email] Batch send error:', err.message));
  }

  res.status(200).json({
    success: true,
    message: `Connection request ${status} successfully`,
    data: connectionRequest,
  });
});
