import mongoose from 'mongoose';

// ============================================================
//  BASE USER SCHEMA
//  All roles share these fields. Discriminators add role-specific ones.
// ============================================================
const baseOptions = {
  discriminatorKey: 'role',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    resume: {
      type: String,
      default: '',
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    tagline: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    // 'role' is managed by the discriminatorKey — do NOT define it manually
  },
  baseOptions
);

const User = mongoose.model('User', userSchema);

// ============================================================
//  STUDENT DISCRIMINATOR
// ============================================================
const studentSchema = new mongoose.Schema({
  collegeName: { type: String, required: true, trim: true },
  degree:      { type: String, required: true, trim: true },
  branch:      { type: String, required: true, trim: true },
  yearOfStudy: { type: String, required: true },
  experience:  { type: String, default: '' },
  yearOfJoining: { type: Number, required: true },
  yearOfPassing: { type: Number, required: true },
  graduationYear: { type: String, default: '' },
  dob:           { type: String, required: true },
  gender:        { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  maritalStatus: { type: String, required: true, enum: ['Single', 'Married'] },
  languages:     { type: [String], default: [] },
  skills:        { type: [String], default: [] },
  careerInterests: { type: [String], default: [] },
});

const Student = User.discriminator('student', studentSchema);

// ============================================================
//  ASPIRANT DISCRIMINATOR
// ============================================================
const aspirantSchema = new mongoose.Schema({
  highestQualification: { type: String, required: true, trim: true },
  passedFrom:           { type: String, required: true, trim: true },
  yearOfPassing:        { type: Number, required: true },
  gapYears:             { type: Number, default: 0 },
  preparingFor:         { type: String, required: true, trim: true },
  dob:                  { type: String, required: true },
  gender:               { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  maritalStatus:        { type: String, required: true, enum: ['Single', 'Married'] },
  languages:            { type: [String], default: [] },
  skills:               { type: [String], default: [] },
  collegeName:          { type: String, default: '', trim: true },
  degree:               { type: String, default: '', trim: true },
  graduationYear:       { type: String, default: '' },
  experience:           { type: String, default: '' },
});

const Aspirant = User.discriminator('aspirant', aspirantSchema);

// ============================================================
//  ORGANIZATION DISCRIMINATOR
// ============================================================
const organizationSchema = new mongoose.Schema({
  companyName:     { type: String, required: true, trim: true },
  contactPhone:    { type: String, default: '', trim: true },
  hrName:          { type: String, required: true, trim: true },
  hqLocation:      { type: String, required: true, trim: true },
  address:         { type: String, required: true, trim: true },
  companyType:     { type: String, required: true, trim: true },
  industry:        { type: String, required: true, trim: true },
  companySize:     { type: String, required: true, trim: true },
  yearEstablished: { type: Number, required: true },
  websiteUrl:      { type: String, default: '', trim: true },
  hiringFor:       { type: [String], default: [] },
  hiringForOther:  { type: String, default: '', trim: true },
});

const Organization = User.discriminator('organization', organizationSchema);

// ============================================================
//  PROFESSOR DISCRIMINATOR
// ============================================================
const professorSchema = new mongoose.Schema({
  institute:          { type: String, required: true, trim: true },
  department:         { type: String, required: true, trim: true },
  domainExpertise:    { type: String, required: true, trim: true },
  mentoringInterests: { type: [String], default: [] },
});

const Professor = User.discriminator('professor', professorSchema);

// ============================================================
//  PROFESSIONAL DISCRIMINATOR
// ============================================================
const professionalSchema = new mongoose.Schema({
  contactNumber:    { type: String, required: true, trim: true },
  organizationName: { type: String, default: '', trim: true },
  professionTitle:  { type: String, required: true, trim: true },
  keySkills:        { type: [String], default: [] },
  experience:       { type: String, default: '' },
});

const Professional = User.discriminator('professional', professionalSchema);

// ============================================================
//  RECRUITER DISCRIMINATOR
// ============================================================
const recruiterSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  workEmail:   { type: String, default: '', trim: true },
  // Work email from the UI maps to the base `email` field
});

const Recruiter = User.discriminator('recruiter', recruiterSchema);

// ============================================================
//  OTHERS DISCRIMINATOR
// ============================================================
const othersSchema = new mongoose.Schema({
  lookingFor: { type: String, required: true, trim: true },
});

const Others = User.discriminator('others', othersSchema);

// ============================================================
//  ADMIN — no extra fields, just the discriminator key
// ============================================================
const adminSchema = new mongoose.Schema({});
const Admin = User.discriminator('admin', adminSchema);

// ============================================================
//  EXPORTS
// ============================================================
export default User;
export { Student, Aspirant, Organization, Professor, Professional, Recruiter, Others, Admin };
