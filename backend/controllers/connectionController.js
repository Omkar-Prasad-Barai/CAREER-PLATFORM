import ConnectionRequest from '../models/ConnectionRequest.js';
import User from '../models/User.js';
import { sendEmail } from '../services/emailService.js';
import * as emailTemplates from '../services/emailTemplates.js';

// @desc    Seeker requests a connection with a facilitator
// @route   POST /api/connections/request
// @access  Private (Seekers: student, aspirant)
export const requestConnection = async (req, res) => {
  try {
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
      message: 'Request sent to Admin for approval',
      connectionRequest,
    });
  } catch (error) {
    console.error('Request Connection Error:', error.message);
    res.status(500).json({ message: 'Server error while creating connection request' });
  }
};

// @desc    Admin fetches all pending connection requests
// @route   GET /api/connections/admin/pending
// @access  Private (Admin only)
export const getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await ConnectionRequest.find({ status: 'pending_admin' })
      .populate('seekerId', 'fullName email profileDetails')
      .populate('facilitatorId', 'fullName email')
      .populate('opportunityId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Get Pending Requests Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching pending requests' });
  }
};

// @desc    Admin approves or rejects a connection request
// @route   PUT /api/connections/admin/update/:id
// @access  Private (Admin only)
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
    }

    const connectionRequest = await ConnectionRequest.findById(req.params.id)
      .populate('seekerId', 'fullName email')
      .populate('facilitatorId', 'fullName email')
      .populate('opportunityId', 'title');

    if (!connectionRequest) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    connectionRequest.status = status;
    if (adminNotes) connectionRequest.adminNotes = adminNotes;
    await connectionRequest.save();

    // Send notification emails on approval (non-blocking)
    if (status === 'approved') {
      const seeker = connectionRequest.seekerId;
      const facilitator = connectionRequest.facilitatorId;
      const opportunityTitle = connectionRequest.opportunityId?.title || 'an opportunity';
      const platformUrl = process.env.CLIENT_URL || 'http://localhost:5173';

      // Fire-and-forget with Promise.allSettled — never block the response
      Promise.allSettled([
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
      message: `Connection request ${status} successfully`,
      connectionRequest,
    });
  } catch (error) {
    console.error('Update Request Status Error:', error.message);
    res.status(500).json({ message: 'Server error while updating request status' });
  }
};
