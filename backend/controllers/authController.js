import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../services/emailService.js';
import asyncHandler from '../utils/asyncHandler.js';
import User, {
  Student,
  Aspirant,
  Organization,
  Professor,
  Professional,
  Recruiter,
  Others,
} from '../models/User.js';

// ============================================================
//  HELPERS
// ============================================================

/** Generate JWT token — fails fast if secret is missing */
const generateToken = (userId, role, expiresIn = '24h') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET is not defined in .env — cannot sign tokens.');
  }
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

/** Map role string to the correct Discriminator Model */
const getModelForRole = (role) => {
  const models = {
    student: Student,
    aspirant: Aspirant,
    organization: Organization,
    professor: Professor,
    professional: Professional,
    recruiter: Recruiter,
    others: Others,
  };
  return models[role] || null;
};

/**
 * Convert comma-separated string → trimmed array.
 * Passes through if already an array.
 */
const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value).split(',').map((v) => v.trim()).filter(Boolean);
};

/**
 * Build the role-specific field object from req.body.
 * Each role extracts exactly the fields its schema expects.
 */
const buildProfileFields = (role, body) => {
  switch (role) {
    case 'student':
      return {
        collegeName:    body.college || body.collegeName || '',
        degree:         body.degree || '',
        branch:         body.branch || '',
        yearOfStudy:    body.yearOfStudy || '',
        experience:     body.experience || '',
        yearOfJoining:  body.yearOfJoining ? Number(body.yearOfJoining) : undefined,
        yearOfPassing:  body.yearOfPassing ? Number(body.yearOfPassing) : undefined,
        dob:            body.dob || '',
        gender:         body.gender || '',
        maritalStatus:  body.maritalStatus || '',
        languages:      toArray(body.languages),
        skills:         toArray(body.skills),
        careerInterests: toArray(body.careerInterests),
      };

    case 'aspirant':
      return {
        highestQualification: body.highestQualification || '',
        passedFrom:           body.passedFrom || '',
        yearOfPassing:        body.yearOfPassing ? Number(body.yearOfPassing) : undefined,
        gapYears:             body.gapYears ? Number(body.gapYears) : 0,
        preparingFor:         body.preparingFor || '',
        dob:                  body.dob || '',
        gender:               body.gender || '',
        maritalStatus:        body.maritalStatus || '',
        languages:            toArray(body.languages),
        skills:               toArray(body.skills),
      };

    case 'organization':
      return {
        companyName:     body.companyName || body.fullName || '',
        contactPhone:    body.contactPhone || '',
        hrName:          body.hrName || '',
        hqLocation:      body.hqLocation || '',
        address:         body.address || '',
        companyType:     body.companyType || '',
        industry:        body.industry || '',
        companySize:     body.companySize || '',
        yearEstablished: body.yearEstablished ? Number(body.yearEstablished) : undefined,
        websiteUrl:      body.websiteUrl || '',
        hiringFor:       toArray(body.hiringFor),
        hiringForOther:  body.hiringForOther || '',
      };

    case 'professor':
      return {
        institute:          body.institute || '',
        department:         body.department || '',
        domainExpertise:    body.domainExpertise || '',
        mentoringInterests: toArray(body.mentoringInterests),
      };

    case 'professional':
      return {
        contactNumber:    body.contactNumber || '',
        organizationName: body.organizationName || '',
        professionTitle:  body.professionTitle || '',
        keySkills:        toArray(body.skills || body.keySkills),
      };

    case 'recruiter':
      return {
        companyName: body.companyName || '',
      };

    case 'others':
      return {
        lookingFor: body.lookingFor || '',
      };

    default:
      return {};
  }
};

// ============================================================
//  REGISTER
// ============================================================

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  // --- Validate base fields ---
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: fullName, email, password, role.',
    });
  }

  // --- Validate role ---
  const RoleModel = getModelForRole(role);
  if (!RoleModel) {
    return res.status(400).json({ success: false, message: `Invalid role: ${role}` });
  }

  // --- Check duplicate ---
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists with this email.' });
  }

  // --- Hash password ---
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // --- Build role-specific fields ---
  const profileFields = buildProfileFields(role, req.body);

  // --- Create user using the correct Discriminator Model ---
  const user = await RoleModel.create({
    fullName,
    email,
    password: hashedPassword,
    ...profileFields,
  });

  // --- Generate token ---
  const token = generateToken(user._id, user.role);

  // --- Build response (exclude password) ---
  const userObj = user.toObject();
  delete userObj.password;

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    ...userObj,
    token,
  });
});

// ============================================================
//  LOGIN  (uses base User model — finds any role)
// ============================================================

// @desc    Login an existing user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  // Find user by email (base model query finds ALL discriminators)
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  // Generate token with appropriate expiry
  const tokenExpiry = rememberMe ? '30d' : '24h';
  const token = generateToken(user._id, user.role, tokenExpiry);

  // Set HttpOnly cookie as fallback secure store
  res.cookie('cc_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
  });

  // Build response (exclude password)
  const userObj = user.toObject();
  delete userObj.password;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    ...userObj,
    token,
  });
});

// ============================================================
//  FORGOT PASSWORD
// ============================================================

// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Always return 200 to prevent email enumeration
  const genericMessage = 'If this email exists, a reset link has been sent.';

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ success: true, message: genericMessage });
  }

  // Generate secure token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  // Store hashed token + expiry
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  await user.save();

  // Build reset URL
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

  // Send email via centralized service
  const htmlContent = `
    <div style="max-width:520px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F5F4F0;border-radius:16px;overflow:hidden;border:1px solid #E5E7EB;">
      <div style="background:linear-gradient(135deg,#6366F1,#8B5CF6);padding:32px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">CareerConnect</h1>
      </div>
      <div style="padding:32px 24px;">
        <h2 style="color:#1A1D23;font-size:20px;font-weight:700;margin:0 0 12px;">Password Reset Request</h2>
        <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:0 0 24px;">
          You requested a password reset. Click the button below to choose a new password. This link expires in <strong>15 minutes</strong>.
        </p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${resetUrl}" style="display:inline-block;background:#6366F1;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;font-size:15px;">
            Reset Password
          </a>
        </div>
        <p style="color:#9CA3AF;font-size:12px;line-height:1.5;margin:24px 0 0;border-top:1px solid #E5E7EB;padding-top:16px;">
          If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
        </p>
      </div>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Reset Your CareerConnect Password',
    html: htmlContent,
  });

  res.status(200).json({ success: true, message: genericMessage });
});

// ============================================================
//  RESET PASSWORD
// ============================================================

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }

  // Hash the incoming token and find matching user
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' });
  }

  // Hash new password with bcrypt (12 rounds)
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(password, salt);

  // Clear reset token fields
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
});
