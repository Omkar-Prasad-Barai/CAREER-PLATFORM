import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema(
  {
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seeker ID is required'],
    },
    facilitatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Facilitator ID is required'],
    },
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['pending_admin', 'approved', 'rejected'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending_admin',
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

export default ConnectionRequest;
