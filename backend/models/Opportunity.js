import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    facilitatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Facilitator ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Internship', 'Full-time', 'Part-time', 'Project', 'Contract'],
      default: 'Full-time',
    },
    jobType: {
      type: String,
      trim: true,
    },
    stipendOrSalary: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      default: '',
      trim: true,
    },
    eligibility: {
      type: String,
      default: '',
      trim: true,
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

export default Opportunity;
