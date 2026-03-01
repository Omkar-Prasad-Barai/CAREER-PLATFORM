import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Announcement message is required'],
      trim: true,
    },
    emoji: {
      type: String,
      default: '🔥',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
